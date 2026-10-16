"use client";
import { Shell } from "@/components/Shell";

export default function TeacherOverviewPage() {
  return (
    <Shell role="teacher">
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ink-900">🏠 Overview</h1>
          <p className="text-slate2-500 mt-1">
            Welcome back! Here's a summary of your teaching activities.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">My Classes</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">4</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Students</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">128</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Pending Grades</p>
            <p className="mt-2 text-3xl font-bold text-brass-600">23</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Today's Classes</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">3</p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="rounded-lg border border-chalk-300 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">📅 Today's Schedule</h2>
          <div className="space-y-3">
            {[
              { time: "08:30 - 10:00", course: "CS101 - Intro to Programming", room: "Room 201" },
              { time: "10:15 - 11:45", course: "CS201 - Data Structures", room: "Room 305" },
              { time: "14:00 - 15:30", course: "CS301 - Algorithms", room: "Lab A" },
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

        {/* Recent Announcements */}
        <div className="rounded-lg border border-chalk-300 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">📢 Recent Announcements</h2>
          <div className="space-y-3">
            {[
              { title: "Semester II Registration Open", date: "2 days ago" },
              { title: "Grade Submission Deadline Extended", date: "1 week ago" },
              { title: "Faculty Meeting - Next Monday", date: "2 weeks ago" },
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