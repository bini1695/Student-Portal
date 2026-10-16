"use client";
import { Shell } from "@/components/Shell";

export default function DeptHeadAssignmentsPage() {
  const sections = [
    { id: 1, section: "CS101-01", course: "Intro to Programming", teacher: "Dr. Abebe", students: 45, status: "active" },
    { id: 2, section: "CS101-02", course: "Intro to Programming", teacher: "Dr. Tadesse", students: 42, status: "active" },
    { id: 3, section: "CS201-01", course: "Data Structures", teacher: "Dr. Getachew", students: 38, status: "active" },
    { id: 4, section: "CS301-01", course: "Algorithms", teacher: "Dr. Alemu", students: 32, status: "active" },
    { id: 5, section: "CS401-01", course: "Database Systems", teacher: "Unassigned", students: 28, status: "pending" },
  ];

  return (
    <Shell role="department-head">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">📚 Course Sections</h1>
          <p className="text-slate2-500 mt-1">Manage department course sections and teacher assignments.</p>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-chalk-50 text-xs uppercase text-slate2-500">
              <tr>
                <th className="px-6 py-3 text-left">Section</th>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Teacher</th>
                <th className="px-6 py-3 text-center">Students</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chalk-200">
              {sections.map((s) => (
                <tr key={s.id} className="hover:bg-chalk-50">
                  <td className="px-6 py-4 font-bold text-ink-900">{s.section}</td>
                  <td className="px-6 py-4 text-slate2-500">{s.course}</td>
                  <td className="px-6 py-4">
                    <span className={s.teacher === "Unassigned" ? "text-red-600 font-medium" : "text-ink-900"}>
                      {s.teacher}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{s.students}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      s.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {s.status}
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