'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BookOpen, Check, Clock, Users } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { SearchInput } from '@/components/ui/SearchInput';

export default function StudentEnrollPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [dropping, setDropping] = useState<number | null>(null);

  const load = async () => {
    try {
      const [sRes, cRes, eRes] = await Promise.all([
        api.get('/course-sections'),
        api.get('/courses'),
        api.get('/enrollments'),
      ]);
      setSections(sRes.data || []);
      setCourses(cRes.data || []);
      setEnrollments(eRes.data || []);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getCourse = (id: number) => courses.find((c) => c.id === id);
  const getEnrollment = (sectionId: number) =>
    enrollments.find(
      (e) => e.courseSectionId === sectionId && ['pending', 'approved'].includes(e.status),
    );

  const handleEnroll = async (sectionId: number) => {
    setEnrolling(sectionId);
    try {
      await api.post('/enrollments', { courseSectionId: sectionId });
      toast.success('Enrollment submitted!');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(null);
    }
  };

  const handleDrop = async (enrollmentId: number) => {
    setDropping(enrollmentId);
    try {
      await api.patch(`/enrollments/${enrollmentId}`, { status: 'dropped' });
      toast.success('Course dropped');
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to drop course');
    } finally {
      setDropping(null);
    }
  };

  const filtered = sections.filter((s) => {
    const c = getCourse(s.courseId);
    const q = search.toLowerCase();
    return (
      !search ||
      c?.code?.toLowerCase().includes(q) ||
      c?.title?.toLowerCase().includes(q) ||
      s.sectionName?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enroll in a Course</h1>
        <p className="text-gray-500 mt-1">
          Browse available sections and enroll
        </p>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by course or section..."
      />

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No sections available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => {
            const c = getCourse(s.courseId);
            const enrollment = getEnrollment(s.id);
            const enrolled = Boolean(enrollment);
            return (
              <div key={s.id} className="card hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <BookOpen size={20} />
                  </div>
                  {enrolled && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <Check size={12} /> {enrollment.status === 'pending' ? 'Pending approval' : 'Enrolled'}
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block mt-3">
                  {c?.code || 'N/A'}
                </span>

                <h3 className="font-semibold mt-2">
                  {c?.title || 'Course'}
                </h3>
                <p className="text-sm text-gray-500">Section {s.sectionName}</p>

                <div className="text-sm text-gray-500 mt-3 space-y-1">
                  <p className="flex items-center gap-2">
                    <Clock size={14} /> {s.dayOfWeek} {s.startTime}–{s.endTime}
                  </p>
                  <p>Room: {s.room || 'TBA'}</p>
                  <p className="flex items-center gap-2">
                    <Users size={14} /> {s.enrolledCount}/{s.capacity}
                  </p>
                </div>

                {enrollment ? (
                  <button
                    onClick={() => handleDrop(enrollment.id)}
                    disabled={dropping === enrollment.id}
                    className="btn btn-secondary w-full mt-4"
                  >
                    {dropping === enrollment.id ? 'Dropping...' : 'Drop Course'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(s.id)}
                    disabled={enrolling === s.id}
                    className="btn btn-primary w-full mt-4"
                  >
                    {enrolling === s.id ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}