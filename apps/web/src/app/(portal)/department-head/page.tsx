"use client";
import { Shell } from "@/components/Shell";
import { toast } from "sonner";
import { useState } from "react";

export default function DeptHeadGradesPage() {
  const [items, setItems] = useState([
    { id: 1, student: "Hana Tesfaye", section: "CS101-01", score: 88, grade: "A", status: "pending" },
    { id: 2, student: "Bekele Girma", section: "MATH201-02", score: 75, grade: "B+", status: "pending" },
    { id: 3, student: "Sara Mekonnen", section: "ENG102-01", score: 92, grade: "A", status: "approved" },
    { id: 4, student: "Yohannes Alemu", section: "PHY101-03", score: 68, grade: "C+", status: "pending" },
  ]);

  const handleAction = (id: number, status: "approved" | "rejected") => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    toast.success(`Grade ${status}!`);
  };

  return (
    <Shell role="department-head">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">🎓 Grade Approval</h1>
          <p className="text-slate2-500 mt-1">Review and approve submitted grades.</p>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-chalk-50 text-xs uppercase text-slate2-500">
              <tr>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Section</th>
                <th className="px-6 py-3 text-center">Score</th>
                <th className="px-6 py-3 text-center">Grade</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chalk-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-chalk-50">
                  <td className="px-6 py-4 font-medium text-ink-900">{item.student}</td>
                  <td className="px-6 py-4 text-slate2-500">{item.section}</td>
                  <td className="px-6 py-4 text-center font-bold">{item.score}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      {item.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.status === "approved" ? "bg-green-100 text-green-700" :
                      item.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction(item.id, "approved")}
                          className="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "rejected")}
                          className="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 border border-red-200"
                        >
                          ✗
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate2-500">—</span>
                    )}
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