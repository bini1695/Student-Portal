"use client";
import { Shell } from "@/components/Shell";

export default function SuperAdminOverviewPage() {
  return (
    <Shell role="super-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">
            👑 Super Admin Dashboard
          </h1>
          <p className="text-slate2-500 mt-1">
            Complete system control and management.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Users</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">1,335</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">System Health</p>
            <p className="mt-2 text-3xl font-bold text-green-600">98%</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Active Logs</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">12,847</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Roles</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">6</p>
          </div>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">⚙️ System Health</h2>
          <div className="space-y-4">
            {[
              { label: "Database", value: 98, color: "bg-green-500" },
              { label: "API Response", value: 92, color: "bg-green-500" },
              { label: "Storage", value: 67, color: "bg-yellow-500" },
              { label: "Server Load", value: 45, color: "bg-green-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-ink-900">{item.label}</span>
                  <span className="font-bold text-ink-900">{item.value}%</span>
                </div>
                <div className="h-2 bg-chalk-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} transition-all`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}