"use client";
import { Shell } from "@/components/Shell";

export default function AdminTimetablePage() {
  const schedule = [
    { id: 1, section: "CS101-01", course: "Intro to Programming", teacher: "Dr. Abebe", day: "Mon/Wed", time: "08:30-10:00", room: "201" },
    { id: 2, section: "CS201-02", course: "Data Structures", teacher: "Dr. Tadesse", day: "Tue/Thu", time: "10:15-11:45", room: "305" },
    { id: 3, section: "MATH201-01", course: "Calculus II", teacher: "Dr. Getachew", day: "Mon/Wed", time: "14:00-15:30", room: "105" },
    { id: 4, section: "ENG102-01", course: "English Composition", teacher: "Dr. Alemu", day: "Fri", time: "09:00-12:00", room: "302" },
  ];

  return (
    <Shell role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">📅 Course Sections</h1>
          <p className="text-slate2-500 mt-1">Manage the university's class timetable.</p>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-chalk-50 text-xs uppercase text-slate2-500">
              <tr>
                <th className="px-6 py-3 text-left">Section</th>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Teacher</th>
                <th className="px-6 py-3 text-center">Day</th>
                <th className="px-6 py-3 text-center">Time</th>
                <th className="px-6 py-3 text-center">Room</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chalk-200">
              {schedule.map((s) => (
                <tr key={s.id} className="hover:bg-chalk-50">
                  <td className="px-6 py-4 font-bold text-ink-900">{s.section}</td>
                  <td className="px-6 py-4">{s.course}</td>
                  <td className="px-6 py-4 text-slate2-500">{s.teacher}</td>
                  <td className="px-6 py-4 text-center">{s.day}</td>
                  <td className="px-6 py-4 text-center">{s.time}</td>
                  <td className="px-6 py-4 text-center">{s.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}