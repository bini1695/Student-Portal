# API setup

Configure the MySQL connection in `apps/api/.env`, then apply the SQL migrations
in `apps/api/migrations` to that database before starting the API. The dated SQL
files are one-time migrations and should be applied in date order; do not rerun
them after they have succeeded.

For a local PowerShell setup with the MySQL client installed:

```powershell
Get-Content .\migrations\20261015_role_workflows.sql -Raw | mysql -h localhost -u student_portal -p student_portal
Get-Content .\migrations\20261016_assignment_submissions.sql -Raw | mysql -h localhost -u student_portal -p student_portal
```

Replace the host, user, and database name to match the API environment. `mysql`
prompts for the database password. The role workflow migration adds grade and
payment review state, offering approval, student admission review statuses,
financial holds, and profiles for existing student accounts. The assignment
migration adds persisted written submissions and grading state.