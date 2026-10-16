"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { EmptyState, Skeleton } from "./ui";

interface Section { id: number; code: string; title: string; credits: number; schedule: string; seats: number; taken: number; teacher: string }
interface Course { id: number; code: string; title: string; creditHours: number }
interface ApiSection {
  id: number;
  courseId?: number;
  sectionName?: string;
  room?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  enrolledCount?: number;
  code?: string;
  title?: string;
  credits?: number;
  schedule?: string;
  seats?: number;
  taken?: number;
  teacher?: string;
}
interface Enrollment { id: number; courseSectionId: number; status: string }

export function StudentEnrollment() {
  const qc = useQueryClient();

  // --- FETCH AVAILABLE SECTIONS ---
  const available = useQuery({
    queryKey: ["enroll", "sections"],
    queryFn: async () => {
      const [sectionResponse, courseResponse] = await Promise.all([
        api.get<ApiSection[]>("/course-sections"),
        api.get<Course[]>("/courses"),
      ]);
      const courses = new Map(courseResponse.data.map((course) => [course.id, course]));
      return sectionResponse.data.map((section): Section => {
        const course = courses.get(section.courseId ?? -1);
        return {
          id: section.id,
          code: section.code ?? course?.code ?? `Section ${section.sectionName ?? section.id}`,
          title: section.title ?? course?.title ?? "Course",
          credits: section.credits ?? course?.creditHours ?? 0,
          schedule: section.schedule ?? [section.dayOfWeek, section.startTime, section.endTime].filter(Boolean).join(" "),
          seats: section.seats ?? Math.max(0, (section.capacity ?? 0) - (section.enrolledCount ?? 0)),
          taken: section.taken ?? section.enrolledCount ?? 0,
          teacher: section.teacher ?? "Instructor not assigned",
        };
      });
    },
  });

  // --- FETCH MY ENROLLMENTS ---
  const mine = useQuery({
    queryKey: ["enroll", "mine"],
    queryFn: async () => (await api.get<Enrollment[]>("/enrollments")).data
      .filter((enrollment) => ["pending", "approved"].includes(enrollment.status)),
  });

  // --- ADD COURSE FUNCTION ---
  const add = useMutation({
    mutationFn: (courseSectionId: number) => api.post("/enrollments", { courseSectionId }),
    onSuccess: () => {
      toast.success("Course added successfully!");
      qc.invalidateQueries({ queryKey: ["enroll"] });
    },
    onError: (error) => {
      toast.error(errorMessage(error) || "Failed to add course");
    },
  });

  // --- DROP COURSE FUNCTION ---
  const drop = useMutation({
    mutationFn: (enrollmentId: number) => api.patch(`/enrollments/${enrollmentId}`, { status: "dropped" }),
    onSuccess: () => {
      toast.success("Course dropped successfully!");
      qc.invalidateQueries({ queryKey: ["enroll"] });
    },
    onError: (e) => {
      toast.error(errorMessage(e) || "Failed to drop course");
    },
  });

  // --- DERIVED DATA ---
  const enrollmentsBySection = new Map(mine.data?.map((enrollment) => [enrollment.courseSectionId, enrollment]) ?? []);
  const myCourses = (available.data ?? []).filter((section) => enrollmentsBySection.has(section.id));
  const credits = myCourses.reduce((total, section) => total + section.credits, 0);

  // --- HANDLER: ADD COURSE ---
  const handleAddCourse = (sectionId: number) => {
    add.mutate(sectionId);
  };

  // --- HANDLER: DROP COURSE ---
  const handleDropCourse = (enrollmentId: number) => {
    if (confirm("Are you sure you want to drop this course?")) {
      drop.mutate(enrollmentId);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      
      {/* LEFT PANEL: Open Sections */}
      <section className="panel">
        <h2 className="border-b border-chalk-200 px-5 py-3 text-lg font-semibold">Open sections</h2>
        <ul className="divide-y divide-chalk-200">
          {available.isLoading && Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="p-5"><Skeleton className="h-10" /></li>
          ))}
          
          {available.isError && (
            <li className="p-5 text-sm text-red-700">{errorMessage(available.error)}</li>
          )}

          {available.data?.map((s) => {
            const full = s.seats <= 0;
            const enrollment = enrollmentsBySection.get(s.id);
            const isAdding = add.isPending && add.variables === s.id;
            const isDropping = drop.isPending && drop.variables === enrollment?.id;

            return (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink-900">{s.code} · {s.title}</p>
                  <p className="text-sm text-slate2-500">
                    {s.teacher} · {s.schedule} · {s.credits} credits · {s.seats} seats left
                  </p>
                </div>

                {enrollment ? (
                  <button 
                    className="btn-danger" 
                    disabled={isDropping} 
                    onClick={() => handleDropCourse(enrollment.id)}
                  >
                    {isDropping ? "Dropping..." : "Drop"}
                  </button>
                ) : (
                  <button 
                    className="btn-primary" 
                    disabled={full || isAdding} 
                    onClick={() => handleAddCourse(s.id)}
                  >
                    {isAdding ? "Adding..." : full ? "Full" : "Add course"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* RIGHT PANEL: My Courses */}
      <aside className="panel h-fit p-5">
        <h2 className="text-lg font-semibold">My courses</h2>
        <p className="mt-1 text-sm text-slate2-500">{credits} of 18 credits</p>
        
        <div className="mt-3 h-2 overflow-hidden rounded bg-chalk-200">
          <div 
            className="h-full bg-brass-500 transition-[width]" 
            style={{ width: `${Math.min(100, (credits / 18) * 100)}%` }} 
          />
        </div>

        {mine.isError && (
          <p className="mt-3 text-sm text-red-700">{errorMessage(mine.error)}</p>
        )}
        
        {mine.data?.length === 0 && (
          <EmptyState title="No courses yet" hint="Add a section from the list." />
        )}
        
        <ul className="mt-4 space-y-3 text-sm">
          {myCourses.map((s) => (
            <li key={s.id}>
              <p className="font-medium text-ink-900">{s.title}</p>
              <p className="text-slate2-500">{s.schedule}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}