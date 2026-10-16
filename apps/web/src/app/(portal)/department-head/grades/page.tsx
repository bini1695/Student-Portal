"use client";
import { Shell } from "@/components/Shell";
import { toast } from "sonner";
import { useState } from "react";

interface GradeItem {
  id: number;
  student: string;
  studentId: string;
  course: string;
  section: string;
  score: number;
  grade: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

export default function DeptHeadGradesPage() {
  const [items, setItems] = useState<GradeItem[]>([
    { id: 1, student: "Hana Tesfaye", studentId: "INU/12345/14", course: "Intro to Programming", section: "CS101-01", score: 88, grade: "A", status: "pending", submittedDate: "2024-01-15" },
    { id: 2, student: "Bekele Girma", studentId: "INU/12346/14", course: "Calculus II", section: "MATH201-02", score: 75, grade: "B+", status: "pending", submittedDate: "2024-01-14" },
    { id: 3, student: "Sara Mekonnen", studentId: "INU/12347/14", course: "English Composition", section: "ENG102-01", score: 92, grade: "A", status: "approved", submittedDate: "2024-01-13" },
    { id: 4, student: "Yohannes Alemu", studentId: "INU/12348/14", course: "Physics I", section: "PHY101-03", score: 68, grade: "C+", status: "pending", submittedDate: "2024-01-12" },
    { id: 5, student: "Marta Assefa", studentId: "INU/12349/14", course: "Data Structures", section: "CS201-01", score: 85, grade: "A-", status: "pending", submittedDate: "2024-01-11" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const handleAction = (id: number, status: "approved" | "rejected") => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    toast.success(`Grade ${status}!`);
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.student.toLowerCase().includes(search.toLowerCase()) ||
      item.studentId.includes(search) ||
      item.section.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-700";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <Shell role="department-head">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">🎓 Grade Approval</h1>
          <p className="text-slate2-500 mt-1">Review and approve submitted grades from teachers.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Grades</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Pending</p>
            <p className="mt-2 text-3xl font-bold text-brass-600">{stats.pending}</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Approved</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Rejected</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          {/* Filters */}
          <div className="border-b border-chalk-300 p-5 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by student, ID, or section..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
            <div className="flex gap-2">
              {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-4 py-2.5 text-xs font-medium capitalize transition-colors ${
                    filter === f
                      ? "bg-ink-900 text-white"
                      : "bg-chalk-100 text-slate2-500 hover:bg-chalk-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 bg-chalk-50 px-6 py-3 text-xs font-semibold uppercase text-slate2-500 border-b border-chalk-300">
            <span className="col-span-3">Student</span>
            <span className="col-span-2">Section</span>
            <span className="col-span-2 text-center">Score</span>
            <span className="col-span-1 text-center">Grade</span>
            <span className="col-span-2 text-center">Status</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-slate2-500">
              <p className="text-lg font-medium">No grades found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter.</p>
            </div>
          )}

          {/* Rows */}
          <div className="divide-y divide-chalk-200">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-chalk-50 transition-colors"
              >
                {/* Student */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-sm font-bold text-white">
                    {item.student.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-ink-900">{item.student}</p>
                    <p className="text-xs text-slate2-500">{item.studentId}</p>
                  </div>
                </div>

                {/* Section */}
                <div className="md:col-span-2">
                  <p className="font-medium text-ink-900">{item.section}</p>
                  <p className="text-xs text-slate2-500">{item.course}</p>
                </div>

                {/* Score */}
                <div className="md:col-span-2 text-center">
                  <span className="text-lg font-bold text-ink-900">{item.score}%</span>
                </div>

                {/* Grade */}
                <div className="md:col-span-1 flex justify-center">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${getGradeColor(item.grade)}`}>
                    {item.grade}
                  </span>
                </div>

                {/* Status */}
                <div className="md:col-span-2 flex justify-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      item.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : item.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex justify-end gap-2">
                  {item.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleAction(item.id, "approved")}
                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 active:scale-95"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleAction(item.id, "rejected")}
                        className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 border border-red-200 active:scale-95"
                      >
                        ✗ Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate2-500">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}