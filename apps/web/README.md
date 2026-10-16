# Campus Portal (Next.js frontend)

Role-based student portal and enrollment UI for a NestJS + MySQL backend.
Roles: super-admin, admin (registrar), department-head, teacher, student, accountant.

## Run
```bash
npm install
cp .env.example .env.local
npm run dev                    # http://localhost:3000
```
The default configuration connects to the Nest API on port 4000. Set `NEXT_PUBLIC_USE_MOCKS=true` in `.env.local` to use demo data instead.

## How it connects to Nest
Browser calls `/api/*`; Next proxies to `API_URL` (see `next.config.mjs`), so there is no CORS and cookies are first-party.

| Purpose | Endpoint | Notes |
|---|---|---|
| Login / logout | `POST /auth/login`, `POST /auth/logout` | Login sets an httpOnly `access_token` cookie; logout clears it. |
| Session | `GET /auth/me` | Returns the authenticated user profile, including `fullName` and role relation. |
| Dashboard | `GET /dashboard/me` | Returns role-specific metrics in `{ role, stats }`. |
| Lists | see `src/lib/roles.ts` | Resource endpoints return arrays; the UI searches and paginates them. |
| Registration | `POST /auth/register { fullName, email, password }` | Public registration creates student accounts. |
| Course registration | `GET /course-sections`, `GET /enrollments`, `POST /enrollments { courseSectionId }`, `PATCH /enrollments/:id { status: "dropped" }` | The API enforces enrollment permissions and eligibility. |
| Enrollment approvals | `GET /enrollments`, `PATCH /enrollments/:id { status: "approved" | "rejected" }` | Admins and department heads can review requests. |

The API uses role values such as `super_admin` and `dept_head`; `toSlug` in `src/lib/roles.ts` maps them to portal routes.
If you use Bearer tokens in localStorage instead of cookies, change `src/lib/api.ts` and `src/middleware.ts`.

## Add a screen
Add an entry to `NAV[role]` in `src/lib/roles.ts` with `endpoint` and `columns`. It appears in the sidebar and renders a searchable, paginated table automatically.

## Security
`middleware.ts` only keeps people out of the wrong dashboard. Your Nest guards (`@Roles()`) must enforce every endpoint.

## Performance choices
TanStack Query caching and `keepPreviousData`, lazy-loaded charts, enrollment mutations, `next/font`, and `optimizePackageImports`.
