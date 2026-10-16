"use client";
import { Shell } from "@/components/Shell";

export default function SuperAdminRolesPage() {
  const roles = [
    { id: 1, name: "Super Admin", description: "Full system access and control", users: 1 },
    { id: 2, name: "Admin", description: "Manage students, courses, and enrollment", users: 5 },
    { id: 3, name: "Department Head", description: "Approve grades and manage department", users: 8 },
    { id: 4, name: "Teacher", description: "Manage classes, grades, attendance", users: 45 },
    { id: 5, name: "Student", description: "Register courses, view grades", users: 1247 },
    { id: 6, name: "Accountant", description: "Manage payments and invoices", users: 3 },
  ];

  return (
    <Shell role="super-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">⚙️ Roles</h1>
          <p className="text-slate2-500 mt-1">System roles and permissions.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <div key={r.id} className="rounded-lg border border-chalk-300 bg-white p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-ink-900">{r.name}</h3>
              <p className="text-sm text-slate2-500 mt-1">{r.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate2-500">Users</span>
                <span className="rounded-full bg-brass-100 px-3 py-1 text-xs font-bold text-brass-700">
                  {r.users}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}