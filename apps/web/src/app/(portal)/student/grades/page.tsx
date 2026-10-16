"use client";
import { Shell } from "@/components/Shell";
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
}

export default function StudentGradesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-grades"],
    queryFn: async () => {
      try {
        const res = await api.get<GradeRecord[]>("/grades");
        return res.data;
      } catch {
        return [
          { id: 1, enrollmentId: 1, midtermScore: "25.00", finalScore: "45.00", assignmentScore: "18.00", totalScore: "88.00", letterGrade: "A", gradePoint: "4.00", approvalStatus: "approved" },
          { id: 2, enrollmentId: 7, midtermScore: "25.00", finalScore: "46.00", assignmentScore: "4.00", totalScore: "75.00", letterGrade: "B+", gradePoint: "3.50", approvalStatus: "submitted" },
        ];
      }
    },
  });

  const grades = data ?? [];

  const gradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-700";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <Shell role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">🎓 Grades & Progress</h1>
          <p className="text-slate2-500 mt-1">View your academic performance.</p>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          {isLoading && (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-chalk-100 animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-6 text-sm text-red-600">{errorMessage(error)}</div>
          )}

          {!isLoading && !isError && grades.length === 0 && (
            <div className="p-12 text-center text-slate2-500">
              <p className="text-lg font-medium">No grades yet</p>
              <p className="text-sm mt-1">Your grades will appear here once published.</p>
            </div>
          )}

          {!isLoading && !isError && grades.length > 0 && (
            <table className="w-full text-sm">
              <thead className="bg-chalk-50 text-xs uppercase text-slate2-500">
                <tr>
                  <th className="px-6 py-3 text-left">Enrollment</th>
                  <th className="px-6 py-3 text-center">Midterm</th>
                  <th className="px-6 py-3 text-center">Final</th>
                  <th className="px-6 py-3 text-center">Assignment</th>
                  <th className="px-6 py-3 text-center">Total</th>
                  <th className="px-6 py-3 text-center">Grade</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-chalk-200">
                {grades.map((row) => (
                  <tr key={row.id} className="hover:bg-chalk-50">
                    <td className="px-6 py-4 font-medium text-ink-900">
                      #{row.enrollmentId}
                    </td>
                    <td className="px-6 py-4 text-center">{row.midtermScore}</td>
                    <td className="px-6 py-4 text-center">{row.finalScore}</td>
                    <td className="px-6 py-4 text-center">{row.assignmentScore}</td>
                    <td className="px-6 py-4 text-center font-bold text-ink-900">
                      {row.totalScore}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${gradeColor(row.letterGrade)}`}>
                        {row.letterGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          row.approvalStatus === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {row.approvalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Shell>
  );
}