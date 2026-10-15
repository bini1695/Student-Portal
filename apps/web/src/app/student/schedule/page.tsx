'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

interface Enrollment {
  id: number;
  courseSectionId: number;
  status: string;
}

interface Section {
  id: number;
  courseId: number;
  sectionName: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
}

interface Course {
  id: number;
  code: string;
  title: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StudentSchedulePage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [enrollmentResponse, sectionResponse, courseResponse] = await Promise.all([
          api.get<Enrollment[]>('/enrollments'),
          api.get<Section[]>('/course-sections'),
          api.get<Course[]>('/courses'),
        ]);
        setEnrollments(enrollmentResponse.data);
        setSections(sectionResponse.data);
        setCourses(courseResponse.data);
      } catch (loadError: any) {
        setError(loadError.response?.data?.message || 'Could not load your course schedule.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const schedule = useMemo(() => {
    const enrolledSectionIds = new Set(
      enrollments.filter(({ status }) => status === 'approved').map(({ courseSectionId }) => courseSectionId),
    );
    return sections
      .filter((section) => enrolledSectionIds.has(section.id))
      .map((section) => ({
        ...section,
        course: courses.find(({ id }) => id === section.courseId),
      }))
      .sort((a, b) =>
        (DAYS.indexOf(a.dayOfWeek ?? '') - DAYS.indexOf(b.dayOfWeek ?? '')) ||
        (a.startTime ?? '').localeCompare(b.startTime ?? ''),
      );
  }, [courses, enrollments, sections]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Weekly Timetable</h1>
        <p className="mt-1 text-gray-500">Your approved course registrations and class times.</p>
      </div>
      {error && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : schedule.length === 0 ? (
        <div className="card py-12 text-center text-gray-500">
          <CalendarDays className="mx-auto mb-3 text-gray-300" size={40} />
          Your approved course schedule will appear here.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DAYS.map((day) => {
            const daySections = schedule.filter((section) => section.dayOfWeek === day);
            return (
              <section key={day} className="card">
                <h2 className="mb-3 flex items-center gap-2 font-semibold">
                  <CalendarDays size={17} className="text-blue-600" /> {day}
                </h2>
                {daySections.length === 0 ? (
                  <p className="text-sm text-gray-400">No classes scheduled.</p>
                ) : (
                  <div className="space-y-3">
                    {daySections.map((section) => (
                      <div key={section.id} className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                        <p className="font-medium">{section.course?.title ?? `Course #${section.courseId}`}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {section.course?.code ?? 'Course'} · Section {section.sectionName}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} />
                          {section.startTime?.slice(0, 5) ?? 'Time TBA'} – {section.endTime?.slice(0, 5) ?? 'TBA'}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">Room: {section.room || 'TBA'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
