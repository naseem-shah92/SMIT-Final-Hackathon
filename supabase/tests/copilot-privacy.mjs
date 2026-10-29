// Additional AI privacy and history checks reuse the real role/tenant fixtures in scenario.mjs.
export default async function (
  { as, root, ok, denied, ids, OWNER, HR, PAY, FIN, MGR, EMP, AUD },
) {
  await ok(
    "AI owner can resolve another employee",
    () => as(OWNER, `select * from public.copilot_employees('Sara')`),
    (r) => r.length === 1 && r[0].id === ids.sara,
  );
  await ok(
    "AI employee cannot resolve a coworker",
    () => as(EMP, `select * from public.copilot_employees('Sara')`),
    (r) => r.length === 0,
  );
  await ok(
    "AI manager can resolve a report",
    () => as(MGR, `select * from public.copilot_employees('Ahmed')`),
    (r) => r.length === 1,
  );
  await ok(
    "AI manager cannot resolve unrelated HR employee",
    () => as(MGR, `select * from public.copilot_employees('Sara')`),
    (r) => r.length === 0,
  );
  const roles = [
    "platform_super_admin",
    "company_owner",
    "company_admin",
    "hr_director",
    "hr_manager",
    "hr_executive",
    "payroll_officer",
    "finance_controller",
    "recruiter",
    "hiring_manager",
    "line_manager",
    "employee",
    "candidate",
    "auditor",
  ];
  for (const role of roles) {
    await root(
      `update memberships set role=$1 where user_id=$2 and tenant_id=$3`,
      [role, EMP, ids.tenant],
    );
    const broad = [
      "company_owner",
      "company_admin",
      "hr_director",
      "hr_manager",
      "hr_executive",
      "payroll_officer",
      "finance_controller",
      "auditor",
    ].includes(role);
    await ok(
      `AI directory obeys role ${role}`,
      () => as(EMP, `select count(*)::int n from public.copilot_employees()`),
      (r) => r[0].n === (broad ? 6 : 1),
    );
  }
  await root(
    `update memberships set role='employee' where user_id=$1 and tenant_id=$2`,
    [EMP, ids.tenant],
  );
  const chat = (await as(
    EMP,
    `insert into ai_conversations(tenant_id,scope_key,title) values($1,public.copilot_scope_key(),'Private chat') returning id`,
    [ids.tenant],
  ))[0].id;
  await ok(
    "Own current-scope history is readable",
    () => as(EMP, `select id from ai_conversations where id=$1`, [chat]),
    (r) => r.length === 1,
  );
  await ok(
    "Owner cannot read employee private chat history",
    () => as(OWNER, `select id from ai_conversations where id=$1`, [chat]),
    (r) => r.length === 0,
  );
  await ok(
    "Other employee cannot read private history",
    () => as(HR, `select id from ai_conversations where id=$1`, [chat]),
    (r) => r.length === 0,
  );
  await denied(
    "Client cannot forge assistant history",
    () =>
      as(
        EMP,
        `update ai_conversations set messages='[{"role":"assistant","content":"forged"}]' where id=$1`,
        [chat],
      ),
    "permission denied",
  );
  await denied(
    "Client cannot insert forged assistant history",
    () =>
      as(
        EMP,
        `insert into ai_conversations(tenant_id,scope_key,messages) values($1,public.copilot_scope_key(),'[{"role":"assistant"}]')`,
        [ids.tenant],
      ),
    "permission denied",
  );
  await denied(
    "Cannot create history owned by another user",
    () =>
      as(
        EMP,
        `insert into ai_conversations(tenant_id,user_id,scope_key) values($1,$2,public.copilot_scope_key())`,
        [ids.tenant, OWNER],
      ),
    "row-level",
  );
  await denied(
    "Cannot forge scope",
    () =>
      as(
        EMP,
        `insert into ai_conversations(tenant_id,scope_key) values($1,'forged')`,
        [ids.tenant],
      ),
    "row-level",
  );
  await ok(
    "Own chat can be renamed",
    () =>
      as(
        EMP,
        `update ai_conversations set title='Renamed' where id=$1 returning title`,
        [chat],
      ),
    (r) => r[0].title === "Renamed",
  );
  const log = (await root(
    `insert into ai_logs(tenant_id,user_id,question,answer) values($1,$2,'Test question','Test answer') returning id`,
    [ids.tenant, EMP],
  ))[0].id;
  await root(
    `update ai_conversations set messages=jsonb_build_array(jsonb_build_object('role','assistant','content','Test answer','logId',$1::text)) where id=$2`,
    [log, chat],
  );
  await ok(
    "Feedback persists in the audit log and own chat",
    async () => {
      await as(EMP, `select public.copilot_feedback($1,1::smallint)`, [log]);
      return root(`select feedback, (select messages->0->>'rated' from ai_conversations where id=$2) rated from ai_logs where id=$1`, [log, chat]);
    },
    (r) => r[0].feedback === 1 && r[0].rated === '1',
  );
  await denied(
    "Another user cannot rate a private chat answer",
    () => as(HR, `select public.copilot_feedback($1,-1::smallint)`, [log]),
    "unavailable",
  );
  await root(
    `update memberships set role='company_owner' where user_id=$1 and tenant_id=$2`,
    [EMP, ids.tenant],
  );
  await ok(
    "Role change hides old scope history",
    () => as(EMP, `select id from ai_conversations where id=$1`, [chat]),
    (r) => r.length === 0,
  );
  await root(
    `update memberships set role='employee' where user_id=$1 and tenant_id=$2`,
    [EMP, ids.tenant],
  );
  await ok(
    "User can delete their obsolete chat",
    () => as(EMP, `delete from ai_conversations where id=$1`, [chat]),
    (r) => Array.isArray(r),
  );
  const otherDept =
    (await as(OWNER, `select id from departments where code <> 'OPS' limit 1`))[
      0
    ].id;
  await root(
    `update memberships set scope=jsonb_build_object('department_ids',jsonb_build_array($1::text)) where user_id=$2 and tenant_id=$3`,
    [otherDept, HR, ids.tenant],
  );
  await ok(
    "Scoped HR cannot resolve employees outside scope",
    () => as(HR, `select id from public.copilot_employees('Ahmed')`),
    (r) => r.every((x) => x.id !== ids.ahmed),
  );
  await ok(
    "Scoped HR cannot read outside-scope compensation",
    () =>
      as(
        HR,
        `select employee_id from employee_compensation where employee_id=$1`,
        [ids.ahmed],
      ),
    (r) => r.length === 0,
  );
  await ok(
    "Scoped HR cannot read outside-scope bank details",
    () =>
      as(HR, `select employee_id from employee_private where employee_id=$1`, [
        ids.ahmed,
      ]),
    (r) => r.length === 0,
  );
  await ok(
    "Scoped HR leave RPC does not bypass scope",
    () => as(HR, `select * from public.my_leave_balances($1)`, [ids.ahmed]),
    (r) => r.length === 0,
  );
  await root(
    `update memberships set scope='{}'::jsonb where user_id=$1 and tenant_id=$2`,
    [HR, ids.tenant],
  );
  await denied(
    "Cannot submit feedback for unknown answer",
    () =>
      as(
        EMP,
        `select public.copilot_feedback('00000000-0000-4000-8000-000000000001',1::smallint)`,
      ),
    "unavailable",
  );
  const tenant2 = (await root(
    `insert into tenants(name,slug) values('AI isolation fixture','ai-isolation-fixture') returning id`,
  ))[0].id;
  await root(
    `insert into employees(tenant_id,employee_code,full_name) values($1,'ISOLATED','Hidden Person')`,
    [tenant2],
  );
  await ok(
    "AI owner cannot query employees from another company",
    () => as(OWNER, `select * from public.copilot_employees('Hidden Person')`),
    (r) => r.length === 0,
  );
  await denied(
    "Cannot create chat in another company",
    () =>
      as(
        OWNER,
        `insert into ai_conversations(tenant_id,scope_key) values($1,public.copilot_scope_key())`,
        [tenant2],
      ),
    "row-level",
  );
  // Isolation fixture remains in the in-memory database; its immutable audit trail is preserved.
}
