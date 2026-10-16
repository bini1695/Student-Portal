"use client";
import { Shell } from "@/components/Shell";
import { useState } from "react";

interface ClassItem {
  id: number;
  code: string;
  title: string;
  section: string;
  room: string;
  schedule: string;
  students: number;
  status: "active" | "completed";
}

export default function TeacherClassesPage() {
  const [search, setSearch] = useState("");

  const classes: ClassItem[] = [
    { id: 1, code: "CS101", title: "Intro to Programming", section: "CS101-01", room: "Room 201", schedule: "Mon/Wed 08:30-10:00", students: 45, status: "active" },
    { id: 2, code: "CS201", title: "Data Structures", section: "CS201-02", room: "Room 305", schedule: "Tue/Thu 10:15-11:45", students: 38, status: "active" },
    { id: 3, code: "CS301", title: "Algorithms", section: "CS301-01", room: "Lab A", schedule: "Mon/Wed 14:00-15:30", students: 32, status: "active" },
    { id: 4, code: "CS401", title: "Database Systems", section: "CS401-03", room: "Room 108", schedule: "Fri 09:00-12:00", students: 28, status: "active" },
  ];

  const filtered = classes.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Shell role="teacher">
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ink-900">📚 My Classes</h1>
          <p className="text-slate2-500 mt-1">
            Manage your assigned course sections and view enrolled students.
          </p>
        </div>

        {/* Search */}
        <div className="rounded-lg border border-chalk-300 bg-white p-5">
          <input
            type="text"
            placeholder="Search by course code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none focus:ring-2 focus:ring-brass-500/20"
          />
        </div>

        {/* Classes Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-chalk-300 bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-ink-900 font-bold text-white">
                    {c.code.slice(-3)}
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">{c.code}</p>
                    <p className="text-xs text-slate2-500">{c.section}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    c.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <h3 className="font-semibold text-ink-900 mb-1">{c.title}</h3>

              <div className="mt-4 space-y-2 text-sm text-slate2-500">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{c.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>{c.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>{c.students} students enrolled</span>
                </div>
              </div>

              <button className="mt-5 w-full rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-lg border border-chalk-300 bg-white p-12 text-center">
            <p className="text-slate2-500">No classes found matching "{search}"</p>
          </div>
        )}
      </div>
    </Shell>
  );
}