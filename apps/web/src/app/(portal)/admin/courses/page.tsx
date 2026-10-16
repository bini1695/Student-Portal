"use client";
import { Shell } from "@/components/Shell";

export default function AdminCoursesPage() {
  const courses = [
    { id: 1, code: "CS101", title: "Intro to Programming", credits: 3, dept: "CS" },
    { id: 2, code: "CS201", title: "Data Structures", credits: 3, dept: "CS" },
    { id: 3, code: "MATH201", title: "Calculus II", credits: 3, dept: "Math" },
    { id: 4, code: "ENG102", title: "English Composition", credits: 3, dept: "English" },
    { id: 5, code: "PHY101", title: "Physics I", credits: 4, dept: "Physics" },
  ];

  return (
    <Shell role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">📚 Course Catalog</h1>
          <p className="text-slate2-500 mt-1">Manage all courses offered by the university.</p>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-chalk-50 text-xs uppercase text-slate2-500">
              <tr>
                <th className="px-6 py-3 text-left">Code</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-center">Credits</th>
                <th className="px-6 py-3 text-left">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chalk-200">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-chalk-50">
                  <td className="px-6 py-4 font-bold text-ink-900">{c.code}</td>
                  <td className="px-6 py-4">{c.title}</td>
                  <td className="px-6 py-4 text-center">{c.credits}</td>
                  <td className="px-6 py-4 text-slate2-500">{c.dept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}