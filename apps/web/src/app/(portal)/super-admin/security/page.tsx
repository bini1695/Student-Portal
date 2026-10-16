"use client";
import { Shell } from "@/components/Shell";

export default function SuperAdminSecurityPage() {
  const logs = [
    { id: 1, actor: "Mekdes Alemu", action: "Created new user", ip: "192.168.1.10", date: "2024-01-15 10:23" },
    { id: 2, actor: "Dr. Abebe", action: "Updated grades for CS101", ip: "192.168.1.25", date: "2024-01-15 09:45" },
    { id: 3, actor: "System", action: "Nightly backup completed", ip: "localhost", date: "2024-01-15 03:00" },
    { id: 4, actor: "Selam Haile", action: "Generated invoice report", ip: "192.168.1.30", date: "2024-01-14 16:20" },
  ];

  return (
    <Shell role="super-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">🔒 Security & Logs</h1>
          <p className="text-slate2-500 mt-1">Monitor system activity and security logs.</p>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-chalk-50 text-xs uppercase text-slate2-500">
              <tr>
                <th className="px-6 py-3 text-left">Actor</th>
                <th className="px-6 py-3 text-left">Action</th>
                <th className="px-6 py-3 text-left">IP Address</th>
                <th className="px-6 py-3 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chalk-200">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-chalk-50">
                  <td className="px-6 py-4 font-medium text-ink-900">{l.actor}</td>
                  <td className="px-6 py-4 text-slate2-500">{l.action}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate2-500">{l.ip}</td>
                  <td className="px-6 py-4 text-slate2-500">{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}