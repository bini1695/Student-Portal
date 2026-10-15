'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BookOpen, Check, Users, X } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

interface Course {
  id: number;
  code: string;
  title: string;
  creditHours: number;
}

interface Section {
  id: number;
  courseId: number;
  sectionName: string;
  teacherId: number | null;
  capacity: number;
  room?: string;
  dayOfWeek?: string;
  startTime?: string;
  offeringStatus: 'submitted' | 'approved' | 'rejected';
}

interface Teacher {
  id: number;
  teacherCode: string;
  departmentId: number;
  specialization?: string;
  user?: { fullName?: string };
}

export default function DepartmentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [courseResponse, sectionResponse, teacherResponse] = await Promise.all([
        api.get<Course[]>('/courses'),
        api.get<Section[]>('/course-sections'),
        api.get<Teacher[]>('/teachers'),
      ]);
      setCourses(courseResponse.data);
      setSections(sectionResponse.data);
      setTeachers(teacherResponse.data);
    } catch {
      toast.error('Could not load department course offerings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reviewOffering = async (sectionId: number, approved: boolean) => {
    setBusyId(sectionId);
    try {
      await api.post(`/course-sections/${sectionId}/review`, { approved });
      toast.success(approved ? 'Course offering approved.' : 'Course offering rejected.');
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not review course offering.');
    } finally {
      setBusyId(null);
    }
  };

  const assignTeacher = async (sectionId: number, teacherId: string) => {
    setBusyId(sectionId);
    try {
      await api.patch(`/course-sections/${sectionId}`, {
        teacherId: teacherId ? Number(teacherId) : null,
      });
      toast.success('Faculty assignment updated.');
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not assign teacher.');
    } finally {
      setBusyId(null);
    }
  };

  const courseById = (courseId: number) => courses.find(({ id }) => id === courseId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Curriculum & Course Offerings</h1>
        <p className="mt-1 text-gray-500">Review proposed sections and assign departmental faculty.</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : sections.length === 0 ? (
        <div className="card py-12 text-center text-gray-500">No course offerings are configured for your department.</div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => {
            const course = courseById(section.courseId);
            return (
              <section key={section.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600"><BookOpen size={20} /></div>
                    <div>
                      <p className="font-semibold">{course?.code ?? 'Course'} · {course?.title ?? `#${section.courseId}`}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Section {section.sectionName} · {course?.creditHours ?? '—'} credits · capacity {section.capacity}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {section.dayOfWeek ?? 'Schedule TBA'} {section.startTime?.slice(0, 5) ?? ''} · {section.room ?? 'Room TBA'}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    section.offeringStatus === 'approved' ? 'bg-green-50 text-green-700' :
                      section.offeringStatus === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {section.offeringStatus}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-end gap-3 border-t pt-4">
                  <label className="min-w-64 flex-1">
                    <span className="label flex items-center gap-2"><Users size={14} /> Assigned teacher</span>
                    <select
                      className="input"
                      value={section.teacherId ?? ''}
                      onChange={(event) => void assignTeacher(section.id, event.target.value)}
                      disabled={busyId === section.id}
                    >
                      <option value="">Unassigned</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.user?.fullName ?? teacher.teacherCode} · {teacher.specialization ?? 'Faculty'}
                        </option>
                      ))}
                    </select>
                  </label>
                  {section.offeringStatus === 'submitted' && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void reviewOffering(section.id, true)}
                        disabled={busyId === section.id}
                        className="btn btn-primary flex items-center gap-2"
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => void reviewOffering(section.id, false)}
                        disabled={busyId === section.id}
                        className="btn btn-secondary flex items-center gap-2 text-red-600"
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
