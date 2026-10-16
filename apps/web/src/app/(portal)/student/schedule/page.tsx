"use client";
import { Shell } from "@/components/Shell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, errorMessage } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

interface Enrollment {
  id: number;
  courseSectionId: number;
  status: string;
  enrolledAt?: string;
}

interface CourseSection {
  id: number;
  courseId: number;
  sectionName?: string;
}

interface Course {
  id: number;
  code: string;
  title: string;
  creditHours: number;
}

export default function StudentSchedulePage() {
  const qc = useQueryClient();
  const [processingId, setProcessingId] = useState<number | null>(null);

  // ✅ 1. የእኔ ምዝገባዎች
  const { data: enrollments, isLoading, isError, error } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: async () => {
      const res = await api.get<Enrollment[]>("/enrollments");
      return res.data.filter((e) => ["pending", "approved"].includes(e.status));
    },
  });

  // ✅ 2. ሴክሽኖች እና ኮርሶች
  const { data: sections } = useQuery({
    queryKey: ["sections"],
    queryFn: async () => {
      const res = await api.get<CourseSection[]>("/course-sections");
      return res.data;
    },
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await api.get<Course[]>("/courses");
      return res.data;
    },
  });

  // ✅ 3. የ Drop ተግባር
  const dropCourse = useMutation({
    mutationFn: (enrollmentId: number) =>
      api.patch(`/enrollments/${enrollmentId}`, { status: "dropped" }),
    onSuccess: () => {
      toast.success("Course dropped successfully!");
      qc.invalidateQueries({ queryKey: ["my-enrollments"] });
      qc.invalidateQueries({ queryKey: ["available-sections"] });
    },
    onError: (e) => toast.error(errorMessage(e) || "Failed to drop course"),
  });

  const handleDrop = (enrollmentId: number) => {
    if (!confirm("Are you sure you want to drop this course?")) return;
    setProcessingId(enrollmentId);
    dropCourse.mutate(enrollmentId, {
      onSettled: () => setProcessingId(null),
    });
  };

  // ✅ 4. የኮርስ ዝርዝር አዘጋጅ
  const sectionsMap = new Map(sections?.map((s) => [s.id, s]) ?? []);
  const coursesMap = new Map(courses?.map((c) => [c.id, c]) ?? []);

  const myCourses = (enrollments ?? []).map((e) => {
    const section = sectionsMap.get(e.courseSectionId);
    const course = section ? coursesMap.get(section.courseId) : null;
    return {
      enrollmentId: e.id,
      sectionId: e.courseSectionId,
      code: course?.code ?? "N/A",
      title: course?.title ?? "Unknown Course",
      credits: course?.creditHours ?? 0,
      status: e.status,
    };
  });

  const totalCredits = myCourses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <Shell role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">📅 My Enrollment</h1>
          <p className="text-slate2-500 mt-1">View and manage your registered courses.</p>
        </div>

        {/* Summary */}
        {!isLoading && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-chalk-300 bg-white p-5">
              <p className="text-sm text-slate2-500">Total Courses</p>
              <p className="mt-2 text-2xl font-bold text-ink-900">{myCourses.length}</p>
            </div>
            <div className="rounded-lg border border-chalk-300 bg-white p-5">
              <p className="text-sm text-slate2-500">Total Credits</p>
              <p className="mt-2 text-2xl font-bold text-ink-900">{totalCredits}</p>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-chalk-300 bg-white p-6">
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-lg bg-chalk-100 animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-4 text-sm text-red-600">{errorMessage(error)}</div>
          )}

          {!isLoading && !isError && myCourses.length === 0 && (
            <div className="p-12 text-center text-slate2-500">
              <p className="text-lg font-medium">No courses yet</p>
              <p className="text-sm mt-1">Register for courses to see them here.</p>
            </div>
          )}

          {!isLoading && !isError && myCourses.length > 0 && (
            <div className="space-y-3">
              {myCourses.map((course) => {
                const isProcessing = processingId === course.enrollmentId;
                return (
                  <div
                    key={course.enrollmentId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-chalk-200 bg-chalk-50 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-ink-900">{course.code}</p>
                        <span className="text-xs text-slate2-500">·</span>
                        <span className="text-xs text-slate2-500">{course.credits} credits</span>
                      </div>
                      <p className="text-sm text-ink-900 mt-1">{course.title}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          course.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {course.status}
                      </span>
                      <button
                        onClick={() => handleDrop(course.enrollmentId)}
                        disabled={isProcessing}
                        className="rounded-md bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 flex items-center gap-2"
                      >
                        {isProcessing ? "Dropping..." : "Drop"}
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