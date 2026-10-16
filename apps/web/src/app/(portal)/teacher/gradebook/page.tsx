"use client";
import { Shell } from "@/components/Shell";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, errorMessage } from "@/lib/api";

interface GradeRecord {
  id: number;
  enrollmentId: number;
  midtermScore: string;
  finalScore: string;
  assignmentScore: string;
  totalScore: string;
  letterGrade: string;
  gradePoint: string;
  approvalStatus: string;
  enteredAt: string;
}

export default function TeacherGradebookPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["grades"],
    queryFn: async () => {
      const res = await api.get<GradeRecord[]>("/grades");
      return res.data;
    },
  });

  const grades = data ?? [];

  const filtered = grades.filter(
    (row) =>
      String(row.enrollmentId).includes(search) ||
      row.letterGrade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Shell role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">📓 Gradebook</h1>
          <p className="text-slate2-500 mt-1">Enter and submit student grades.</p>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <div className="border-b border-chalk-300 p-5">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>

          {isLoading && (
            <div className="p-6 text-center text-slate2-500">Loading...</div>
          )}

          {isError && (
            <div className="p-6">
              <p className="text-sm text-red-600">
                Error: {errorMessage(error)}
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <table className="w-full text-sm">
              <thead className="bg-chalk-50 text-xs uppercase text-slate2-500">
                <tr>
                  <th className="px-4 py-3 text-left">Enrollment ID</th>
                  <th className="px-4 py-3 text-center">Midterm</th>
                  <th className="px-4 py-3 text-center">Final</th>
                  <th className="px-4 py-3 text-center">Assignment</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-center">Grade</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-chalk-200">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-chalk-50">
                    <td className="px-4 py-3 font-medium">#{row.enrollmentId}</td>
                    <td className="px-4 py-3 text-center">{row.midtermScore}</td>
                    <td className="px-4 py-3 text-center">{row.finalScore}</td>
                    <td className="px-4 py-3 text-center">{row.assignmentScore}</td>
                    <td className="px-4 py-3 text-center font-bold">{row.totalScore}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                        {row.letterGrade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                        {row.approvalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="p-12 text-center text-slate2-500">
              No grades found.
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}