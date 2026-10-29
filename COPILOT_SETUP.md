# HCM Copilot: deployment and verification

## Existing Supabase project

Back up your database first. Apply only the new migration; do not run the reset
script or the full schema against an existing installation.

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

If the existing schema was installed with the SQL Editor and its migration
history is not registered with the CLI, run
`supabase/migrations/20261029000013_copilot_conversations.sql` once in the SQL
Editor instead of pushing all migrations. Refresh the schema cache with
`notify pgrst, 'reload schema';` afterwards. This migration adds private
conversations, limits clients to title edits, adds scoped employee lookups,
hardens HR-scoped salary/private/payslip access and tightens leave balance
access. It does not reset or replace company records.

For a brand-new Supabase project, run `supabase/hcm_full_schema.sql` once, or
use the complete migrations folder with the CLI.

## Provider configuration

The primary provider is **Groq** (groq.com, not xAI Grok). Default model:
`llama-3.3-70b-versatile`. The fallback is **OpenRouter**, default
`openrouter/free`. You may select a tool-capable model whose ID ends in `:free`.
Paid fallback IDs are rejected. Both services still have quotas and availability
limits; there is no promise of unlimited free inference.

Create an untracked file `.env.copilot.local`:

```dotenv
GROQ_API_KEY=YOUR_GROQ_KEY
GROQ_MODEL=llama-3.3-70b-versatile
OPENROUTER_API_KEY=YOUR_OPENROUTER_KEY
OPENROUTER_MODEL=openrouter/free
```

Then load it into Supabase and deploy:

```sh
supabase secrets set --env-file .env.copilot.local
supabase functions deploy copilot
```

Keep JWT verification enabled. Supabase supplies `SUPABASE_URL`,
`SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to hosted Edge Functions.
For local Edge Function development supply those through the local Supabase
environment. Never put a provider key or service-role key in a `NEXT_PUBLIC_`
variable, frontend code or a Git commit. The service-role client only persists
already-authorized conversations and audit logs; all live company data tools use
the verified caller's JWT with RLS.

Official provider references:

- https://console.groq.com/docs/model/llama-3.3-70b-versatile
- https://openrouter.ai/openrouter/free
- https://openrouter.ai/docs/guides/features/tool-calling

## Frontend configuration

Copy `.env.example` to `.env.local`. Set the public Supabase URL, anon key and
`NEXT_PUBLIC_SITE_URL` to your real production origin, for example
`https://hr.yourcompany.com` (without a trailing slash). Rebuild after changing
public environment variables. The site URL is necessary for share crawlers to
receive the absolute production social image URL. The favicon, Apple icon and
1200 × 630 PNG are included.

```sh
npm ci
npm run dev
# Production:
npm run build
npm start
```

## What the chatbot does

- Starts with Groq on every new turn. Automatically tries OpenRouter on timeout,
  network failure, rate limits, upstream errors or invalid/empty responses.
  After fallback, the rest of that turn stays on OpenRouter. API keys and
  upstream error bodies never reach the browser.
- Reads server-stored history, not client-provided assistant messages. Every
  turn verifies the signed-in user and active company. Data tools use RLS and
  parameterized queries; there is no arbitrary SQL or write tool.
- Allows owners/admins to request other employees' authorized company data.
  Employees get self-service data; managers get reporting scope; HR
  branch/department scope applies to employee lookups, compensation, private
  data and payslips. Recruiters, hiring managers, finance and auditors keep the
  database permissions their role already has. A platform admin does not gain
  cross-company AI access just by claiming that role in chat.
- Keeps private chats separate by user, company and permission fingerprint.
  Changes to memberships, custom permissions or reporting/branch/department
  organization invalidate access to earlier-scope history. This is intentionally
  conservative: start a new chat after access or organization changes.
  Previously downloaded or copied information cannot be remotely revoked.
- Sends the full retained conversation until an explicit boundary of 120
  messages or 70,000 serialized characters. It never silently drops the first
  questions. At the boundary it asks for a new conversation and keeps old
  history available within its valid scope.
- Supports follow-ups, new chat, searchable history (latest 100 conversations),
  rename, delete, export, copy, regenerate latest answer, persisted
  like/dislike, safe text/Markdown tables and request error recovery. Chat
  answers are returned when a turn completes; token streaming and attachments
  are not included.
- Serializes turns in a conversation with revision checks and a temporary server
  lock. Regeneration replaces only the latest pair on successful completion.
  Deleted chats cannot be resurrected by a late response.
- Uses read-only tools for people/private records, compensation, attendance,
  leave, payslips, payroll runs, approvals, policies, analytics, document
  metadata, expenses, recruitment, performance and helpdesk. AI-driven approvals
  or other mutations are deliberately unavailable.
- Logs question, answer, tools, model, usage and latency. Deleting a chat
  deletes its transcript; company audit records remain subject to the existing
  owner/auditor permissions. Copy/export places a copy on the user's device.

The AI provider receives the current conversation and permitted tool results.
Permissions protect against other app users seeing unauthorized data; they do
not mean company data remains entirely inside Supabase. Configure approved
providers and their retention settings for your company before production use.

## Verification

```sh
npm run typecheck
npm run test:ai
npm run test:db
npm run build
# Optional with Deno installed:
deno check supabase/functions/copilot/index.ts
```

The database test suite runs on PGlite with Supabase auth/storage stand-ins. It
exercises real SQL roles and row-level policies, including all 14 roles, owner
access, employee isolation, manager reports, scoped HR, tenant separation,
private chat ownership and unforgeable stored assistant messages. Provider tests
mock HTTP responses and cover primary success, fallback for 400/401/403/429/5xx,
network failure, timeout, malformed responses, missing keys and context limits.

Before release, verify live in your own Supabase project:

1. As company owner, ask for a named employee's salary and then refer to that
   person in a follow-up.
2. As employee, ask for that coworker's salary; confirm no unauthorized value is
   returned. Confirm the employee's own published payslip works.
3. As manager, ask for reporting-team leave; try an unrelated employee.
4. As scoped HR, query an employee outside the assigned branch/department.
5. Close/reopen the drawer and reload the page; reopen the saved conversation.
   Test feedback and regeneration.
6. In a staging function environment, configure an invalid Groq key and a valid
   OpenRouter key. Confirm a response marked as a backup model; restore the real
   Groq key afterwards.
7. Change the user's role/scope and verify old conversations cannot be reopened.
   Verify a user from a second company cannot access the first company's records
   or chats.

No live Supabase or AI credentials were included in the supplied ZIP, so live
provider responses and hosted database behavior must be verified after
deployment. The landing-page product scenes use clearly labeled illustrative
data.
