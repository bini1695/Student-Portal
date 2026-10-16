"use client";
import { Shell } from "@/components/Shell";

export default function StudentOverviewPage() {
  return (
    <Shell role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">🏠 Overview</h1>
          <p className="text-slate2-500 mt-1">
            Welcome back! Here's a summary of your academic progress.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Current GPA</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">3.75</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Credits Earned</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">45</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Active Courses</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">5</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Pending Fees</p>
            <p className="mt-2 text-3xl font-bold text-brass-600">0 ETB</p>
          </div>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">📅 Today's Schedule</h2>
          <div className="space-y-3">
            {[
              { time: "08:30 - 10:00", course: "CS101 - Intro to Programming", room: "Room 201" },
              { time: "10:15 - 11:45", course: "MATH201 - Calculus II", room: "Room 105" },
              { time: "14:00 - 15:30", course: "ENG102 - English Composition", room: "Room 302" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-chalk-200 bg-chalk-50 p-4">
                <div className="text-sm font-medium text-brass-600 whitespace-nowrap">{item.time}</div>
                <div className="flex-1">
                  <p className="font-medium text-ink-900">{item.course}</p>
                  <p className="text-xs text-slate2-500">{item.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">📢 Recent Announcements</h2>
          <div className="space-y-3">
            {[
              { title: "Semester II Registration Open", date: "2 days ago" },
              { title: "Dormitory Allocation Published", date: "1 week ago" },
              { title: "Library Extended Hours", date: "2 weeks ago" },
            ].map((item, i) => (
              <div key={i} className="border-l-4 border-brass-500 bg-chalk-50 p-4 rounded-r-lg">
                <p className="font-medium text-ink-900">{item.title}</p>
                <p className="text-xs text-slate2-500 mt-1">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}