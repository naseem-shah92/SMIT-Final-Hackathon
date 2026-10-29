-- Persistent AI history. Reads are private to the active user, company AND current access scope.
-- The service client is used only for scoped chat persistence; live data tools always use caller JWT + RLS.
create or replace function public.copilot_scope_key() returns text
language sql stable security definer set search_path = public as $$
 select md5(jsonb_build_object(
  'membership', to_jsonb(m),
  'custom_role', (select to_jsonb(c) from custom_roles c where c.id = m.custom_role_id),
  'organization', (select jsonb_agg(jsonb_build_array(e.id,e.manager_id,e.department_id,e.branch_id,e.status) order by e.id) from employees e where e.tenant_id=m.tenant_id)
 )::text)
 from memberships m where m.user_id=auth.uid() and m.tenant_id=public.current_tenant_id()
$$;
revoke all on function public.copilot_scope_key() from public, anon;
grant execute on function public.copilot_scope_key() to authenticated;

create table public.ai_conversations (
 id uuid primary key default gen_random_uuid(),
 tenant_id uuid not null references public.tenants(id) on delete cascade,
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 scope_key text not null,
 title text not null default 'New conversation' check (length(title) between 1 and 100),
 messages jsonb not null default '[]'::jsonb check (jsonb_typeof(messages)='array'),
 revision integer not null default 0,
 busy_until timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index ai_conversations_history on public.ai_conversations(tenant_id,user_id,updated_at desc);
alter table public.ai_conversations enable row level security;
revoke all on public.ai_conversations from public, anon, authenticated;
grant select, delete on public.ai_conversations to authenticated;
grant insert (tenant_id,user_id,scope_key,title) on public.ai_conversations to authenticated;
grant update (title) on public.ai_conversations to authenticated;
grant all on public.ai_conversations to service_role;
create policy conversations_read on public.ai_conversations for select to authenticated
 using (public.in_tenant(tenant_id) and user_id=auth.uid() and scope_key=public.copilot_scope_key());
create policy conversations_create on public.ai_conversations for insert to authenticated
 with check (public.in_tenant(tenant_id) and user_id=auth.uid() and scope_key=public.copilot_scope_key());
create policy conversations_rename on public.ai_conversations for update to authenticated
 using (public.in_tenant(tenant_id) and user_id=auth.uid() and scope_key=public.copilot_scope_key())
 with check (public.in_tenant(tenant_id) and user_id=auth.uid() and scope_key=public.copilot_scope_key());
-- A user may delete an old conversation even when its former access scope is no longer available.
create policy conversations_delete on public.ai_conversations for delete to authenticated
 using (public.in_tenant(tenant_id) and user_id=auth.uid());

-- Audit answers cannot be rewritten by clients. Only feedback is editable.
revoke update on public.ai_logs from authenticated;
grant update (feedback) on public.ai_logs to authenticated;
drop policy if exists ai_logs_read on public.ai_logs;
create policy ai_logs_read on public.ai_logs for select to authenticated
 using (public.in_tenant(tenant_id) and (public.is_tenant_admin() or public.is_auditor()));
drop policy if exists ai_logs_feedback on public.ai_logs;
create policy ai_logs_feedback on public.ai_logs for update to authenticated
 using (public.in_tenant(tenant_id) and user_id=auth.uid()) with check (public.in_tenant(tenant_id) and user_id=auth.uid());
-- Feedback goes through a restricted function; no need to expose historic audit answers.


-- Prevent stale elevated history from remaining available through audit endpoints after a role change.
-- Company owners and auditors retain the existing company audit permission by design.

-- Harden scoped leave balance lookup: the original security-definer RPC ignored HR branch scope.
create or replace function public.my_leave_balances(p_employee uuid default null, p_year integer default extract(year from current_date)::int)
returns table (leave_type_id uuid, code text, name text, color text, is_paid boolean,
 entitled numeric, used numeric, pending numeric, available numeric)
language sql stable security definer set search_path=public as $$
 select b.leave_type_id,b.code,b.name,b.color,b.is_paid,b.entitled,b.used,b.pending,b.entitled-b.used-b.pending
 from public.leave_balances(coalesce(p_employee,public.current_employee_id()),p_year) b
 where coalesce(p_employee,public.current_employee_id()) is not null
 and (public.is_self(coalesce(p_employee,public.current_employee_id())) or
      (public.is_hr_staff() and public.in_my_scope(p_employee)) or public.is_my_report(p_employee))
 and (select tenant_id from employees where id=coalesce(p_employee,public.current_employee_id()))=public.current_tenant_id()
$$;

-- Restricted, parameterized lookup for AI. Directory browsing in the app remains unchanged.


-- Persist feedback alongside the chat so its selected state survives reload.
create or replace function public.copilot_feedback(p_log uuid, p_feedback smallint) returns void
language plpgsql security definer set search_path=public as $$
begin
 if p_feedback is null or p_feedback not in (-1,1) then raise exception 'Invalid feedback'; end if;
 if not exists (select 1 from ai_conversations c, jsonb_array_elements(c.messages) msg
  where c.tenant_id=public.current_tenant_id() and c.user_id=auth.uid() and c.scope_key=public.copilot_scope_key()
  and msg->>'logId'=p_log::text) then raise exception 'Answer unavailable in current access scope'; end if;
 update ai_logs set feedback=p_feedback where id=p_log and user_id=auth.uid() and tenant_id=public.current_tenant_id();
 if not found then raise exception 'Answer not found'; end if;
 update ai_conversations c set messages=(select jsonb_agg(case when msg->>'logId'=p_log::text then msg||jsonb_build_object('rated',p_feedback) else msg end order by ord)
 from jsonb_array_elements(c.messages) with ordinality as x(msg,ord))
 where c.tenant_id=public.current_tenant_id() and c.user_id=auth.uid() and c.scope_key=public.copilot_scope_key()
 and exists(select 1 from jsonb_array_elements(c.messages) msg where msg->>'logId'=p_log::text);
end $$;
revoke update on public.ai_logs from authenticated;
grant select,insert on public.ai_logs to service_role;

-- Pay-capable HR roles must still respect their assigned branch/department scope.
create or replace function public.copilot_scoped_hr() returns boolean
language sql stable security definer set search_path=public as $$
 select coalesce(public.is_hr_staff() and not public.is_tenant_admin() and m.scope is not null and m.scope <> '{}'::jsonb,false)
 from memberships m where m.user_id=auth.uid() and m.tenant_id=public.current_tenant_id()
$$;
revoke all on function public.copilot_scoped_hr() from public,anon;
grant execute on function public.copilot_scoped_hr() to authenticated;

create or replace function public.copilot_employees(p_query text default '', p_employee uuid default null)
returns table(id uuid,employee_code text,full_name text,job_title text,status text,joining_date date,manager_id uuid,department text)
language sql stable security invoker set search_path=public as $$
 select e.id,e.employee_code,e.full_name,e.job_title,e.status,e.joining_date,e.manager_id,d.name
 from employees e left join departments d on d.id=e.department_id
 where e.tenant_id=public.current_tenant_id()
 and (public.is_self(e.id) or public.is_tenant_admin() or (public.is_hr_staff() and public.in_my_scope(e.id))
      or public.is_my_report(e.id) or (public.can_view_pay() and not public.copilot_scoped_hr()))
 and (p_employee is null or e.id=p_employee)
 and (p_query='' or e.full_name ilike '%'||left(p_query,100)||'%' or e.employee_code ilike '%'||left(p_query,100)||'%' or e.job_title ilike '%'||left(p_query,100)||'%')
 order by e.full_name limit 30
$$;

drop policy if exists comp_read on public.employee_compensation;
create policy comp_read on public.employee_compensation for select to authenticated
 using(public.in_tenant(tenant_id) and (public.is_self(employee_id) or (public.can_view_pay() and (not public.copilot_scoped_hr() or public.in_my_scope(employee_id)))));
drop policy if exists private_read on public.employee_private;
create policy private_read on public.employee_private for select to authenticated
 using(public.in_tenant(tenant_id) and (public.is_self(employee_id) or (public.is_hr_staff() and public.in_my_scope(employee_id)) or (public.can_view_pay() and not public.copilot_scoped_hr())));
drop policy if exists payslips_read on public.payslips;
create policy payslips_read on public.payslips for select to authenticated
 using(public.in_tenant(tenant_id) and ((public.is_self(employee_id) and is_published) or (public.can_view_pay() and (not public.copilot_scoped_hr() or public.in_my_scope(employee_id)))));

revoke all on function public.copilot_feedback(uuid,smallint) from public,anon;
grant execute on function public.copilot_feedback(uuid,smallint) to authenticated;
revoke all on function public.copilot_employees(text,uuid) from public,anon;
grant execute on function public.copilot_employees(text,uuid) to authenticated;
