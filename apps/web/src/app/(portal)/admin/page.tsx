"use client";
import { Shell } from "@/components/Shell";

export default function AdminOverviewPage() {
  return (
    <Shell role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">🛡️ Admin Dashboard</h1>
          <p className="text-slate2-500 mt-1">
            System administration and oversight.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Students</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">1,247</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Courses</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">86</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Teachers</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">45</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Active Semesters</p>
            <p className="mt-2 text-3xl font-bold text-green-600">2</p>
          </div>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">📊 Recent Activities</h2>
          <div className="space-y-3">
            {[
              { user: "Hana Tesfaye", action: "Registered for CS101", time: "2 min ago" },
              { user: "Dr. Abebe", action: "Submitted grades for MATH201", time: "15 min ago" },
              { user: "Bekele Girma", action: "New student registered", time: "1 hour ago" },
              { user: "System", action: "Backup completed", time: "3 hours ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 border-l-4 border-brass-500 bg-chalk-50 p-4 rounded-r-lg">
                <div className="flex-1">
                  <p className="font-medium text-ink-900">{item.user}</p>
                  <p className="text-sm text-slate2-500">{item.action}</p>
                </div>
                <span className="text-xs text-slate2-500 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}