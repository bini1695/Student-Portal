"use client";
import { Shell } from "@/components/Shell";
import { useState } from "react";
import { toast } from "sonner";

interface Student {
  id: number;
  studentId: string;
  name: string;
  status: "present" | "absent" | "late";
}

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("CS101-01");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([
    { id: 1, studentId: "INU/12345/14", name: "Hana Tesfaye", status: "present" },
    { id: 2, studentId: "INU/12346/14", name: "Bekele Girma", status: "present" },
    { id: 3, studentId: "INU/12347/14", name: "Sara Mekonnen", status: "present" },
    { id: 4, studentId: "INU/12348/14", name: "Yohannes Alemu", status: "present" },
    { id: 5, studentId: "INU/12349/14", name: "Marta Assefa", status: "present" },
    { id: 6, studentId: "INU/12350/14", name: "Dawit Bekele", status: "present" },
  ]);

  const classes = ["CS101-01", "CS201-02", "CS301-01", "CS401-03"];

  const setStatus = (id: number, status: Student["status"]) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const markAll = (status: Student["status"]) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSubmit = () => {
    const summary = {
      present: students.filter((s) => s.status === "present").length,
      absent: students.filter((s) => s.status === "absent").length,
      late: students.filter((s) => s.status === "late").length,
    };
    toast.success(
      `Attendance saved! Present: ${summary.present}, Absent: ${summary.absent}, Late: ${summary.late}`
    );
  };

  return (
    <Shell role="teacher">
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ink-900">👥 Attendance</h1>
          <p className="text-slate2-500 mt-1">
            Mark attendance for your classes.
          </p>
        </div>

        {/* Controls */}
        <div className="rounded-lg border border-chalk-300 bg-white p-5">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-ink-900 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
              >
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-ink-900 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => markAll("present")}
                className="rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
              >
                ✓ All Present
              </button>
              <button
                onClick={() => markAll("absent")}
                className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                ✗ All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <div className="border-b border-chalk-300 px-6 py-4">
            <h2 className="font-semibold text-ink-900">
              {selectedClass} — {students.length} students
            </h2>
          </div>

          <div className="divide-y divide-chalk-200">
            {students.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 hover:bg-chalk-50"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-sm font-bold text-white">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-ink-900">{s.name}</p>
                    <p className="text-xs text-slate2-500">{s.studentId}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {(["present", "late", "absent"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatus(s.id, status)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                        s.status === status
                          ? status === "present"
                            ? "bg-green-600 text-white"
                            : status === "late"
                            ? "bg-brass-500 text-white"
                            : "bg-red-600 text-white"
                          : "bg-chalk-100 text-slate2-500 hover:bg-chalk-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="rounded-md bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-800"
          >
            ✓ Submit Attendance
          </button>
        </div>
      </div>
    </Shell>
  );
}