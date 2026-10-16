"use client";
import { Shell } from "@/components/Shell";
import { toast } from "sonner";
import { useState } from "react";

interface Approval {
  id: number;
  student: string;
  studentId: string;
  course: string;
  section: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export default function DeptHeadEnrollmentPage() {
  const [items, setItems] = useState<Approval[]>([
    { id: 1, student: "Hana Tesfaye", studentId: "INU/12345/14", course: "Intro to Programming", section: "CS101-01", status: "pending", date: "2024-01-15" },
    { id: 2, student: "Bekele Girma", studentId: "INU/12346/14", course: "Calculus II", section: "MATH201-02", status: "pending", date: "2024-01-14" },
    { id: 3, student: "Sara Mekonnen", studentId: "INU/12347/14", course: "English Composition", section: "ENG102-01", status: "pending", date: "2024-01-13" },
    { id: 4, student: "Yohannes Alemu", studentId: "INU/12348/14", course: "Physics I", section: "PHY101-03", status: "pending", date: "2024-01-12" },
  ]);

  const handleAction = (id: number, status: "approved" | "rejected") => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    toast.success(`Enrollment ${status}!`);
  };

  const pending = items.filter((i) => i.status === "pending");

  return (
    <Shell role="department-head">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">📝 Enrollment Requests</h1>
          <p className="text-slate2-500 mt-1">Review and approve student course registrations.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Pending</p>
            <p className="mt-2 text-2xl font-bold text-brass-600">{pending.length}</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Approved</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {items.filter((i) => i.status === "approved").length}
            </p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Rejected</p>
            <p className="mt-2 text-2xl font-bold text-red-600">
              {items.filter((i) => i.status === "rejected").length}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-chalk-50 text-xs uppercase text-slate2-500">
              <tr>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Student ID</th>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chalk-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-chalk-50">
                  <td className="px-6 py-4 font-medium text-ink-900">{item.student}</td>
                  <td className="px-6 py-4 text-slate2-500">{item.studentId}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink-900">{item.course}</p>
                    <p className="text-xs text-slate2-500">{item.section}</p>
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
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "rejected")}
                          className="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 border border-red-200"
                        >
                          ✗ Reject
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