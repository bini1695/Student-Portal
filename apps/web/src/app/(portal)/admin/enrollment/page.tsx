"use client";
import { Shell } from "@/components/Shell";
import { toast } from "sonner";

export default function AdminEnrollmentPage() {
  const requests = [
    { id: 1, student: "Hana Tesfaye", course: "CS101-01", status: "pending", date: "2024-01-15" },
    { id: 2, student: "Bekele Girma", course: "MATH201-02", status: "pending", date: "2024-01-14" },
    { id: 3, student: "Sara Mekonnen", course: "ENG102-01", status: "approved", date: "2024-01-13" },
  ];

  return (
    <Shell role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">📝 Enrollment Requests</h1>
          <p className="text-slate2-500 mt-1">Review and manage student enrollment requests.</p>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-chalk-50 text-xs uppercase text-slate2-500">
              <tr>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chalk-200">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-chalk-50">
                  <td className="px-6 py-4 font-medium text-ink-900">{r.student}</td>
                  <td className="px-6 py-4 text-slate2-500">{r.course}</td>
                  <td className="px-6 py-4 text-slate2-500">{r.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      r.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}