"use client";
import { Shell } from "@/components/Shell";
import { toast } from "sonner";
import { useState } from "react";

interface Course {
  id: number;
  code: string;
  title: string;
  credits: number;
  room: string;
  schedule: string;
  seatsLeft: number;
}

export default function StudentEnrollmentPage() {
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);

  const courses: Course[] = [
    { id: 1, code: "CS101", title: "Intro to Programming", credits: 3, room: "Room 201", schedule: "Mon/Wed 08:30-10:00", seatsLeft: 40 },
    { id: 2, code: "MATH201", title: "Calculus II", credits: 3, room: "Room 105", schedule: "Tue/Thu 10:15-11:45", seatsLeft: 40 },
    { id: 3, code: "ENG102", title: "English Composition", credits: 3, room: "Room 302", schedule: "Fri 09:00-12:00", seatsLeft: 40 },
    { id: 4, code: "PHY101", title: "Physics I", credits: 4, room: "Lab A", schedule: "Mon/Wed 14:00-15:30", seatsLeft: 20 },
  ];

  const availableCourses = courses.filter((c) => !enrolledIds.includes(c.id));

  const handleRegister = (courseId: number) => {
    setProcessingId(courseId);
    setTimeout(() => {
      setEnrolledIds((prev) => [...prev, courseId]);
      setProcessingId(null);
      toast.success("Course registered successfully!");
    }, 800);
  };

  const totalCredits = courses
    .filter((c) => enrolledIds.includes(c.id))
    .reduce((sum, c) => sum + c.credits, 0);

  return (
    <Shell role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">📝 Course Registration</h1>
          <p className="text-slate2-500 mt-1">Register for your semester courses.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Available Courses</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">{availableCourses.length}</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">My Enrollments</p>
            <p className="mt-2 text-2xl font-bold text-green-600">{enrolledIds.length}</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Credits</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">{totalCredits}</p>
          </div>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">Available Courses</h2>

          {availableCourses.length === 0 ? (
            <div className="p-12 text-center text-slate2-500">
              <p className="text-lg font-medium">No available courses</p>
              <p className="text-sm mt-1">You have registered for all available sections.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableCourses.map((course) => {
                const isProcessing = processingId === course.id;
                return (
                  <div
                    key={course.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-chalk-200 bg-chalk-50 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-ink-900">{course.code}</p>
                        <span className="text-xs text-slate2-500">·</span>
                        <span className="text-xs text-slate2-500">{course.credits} credits</span>
                      </div>
                      <p className="text-sm text-ink-900 mt-1">{course.title}</p>
                      <p className="text-xs text-slate2-500 mt-1">📍 {course.room} · 🕐 {course.schedule}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate2-500 whitespace-nowrap">
                        {course.seatsLeft} seats left
                      </span>
                      <button
                        onClick={() => handleRegister(course.id)}
                        disabled={isProcessing}
                        className="rounded-md bg-ink-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-ink-800 active:scale-95 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                          </>
                        ) : "Register"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}