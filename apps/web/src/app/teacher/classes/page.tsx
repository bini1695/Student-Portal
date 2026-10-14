'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Clock, Users, Search } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { SearchInput } from '@/components/ui/SearchInput';

export default function TeacherClassesPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [secRes, cRes] = await Promise.all([
          api.get('/course-sections'),
          api.get('/courses'),
        ]);
        setSections(secRes.data || []);
        setCourses(cRes.data || []);
      } catch (err: any) {
        console.error('Classes load error:', err);
        setError(err.response?.data?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getCourse = (id: number) => courses.find((c) => c.id === id);

  const filtered = sections.filter((s) => {
    const course = getCourse(s.courseId);
    const q = search.toLowerCase();
    return (
      s.sectionName?.toLowerCase().includes(q) ||
      s.room?.toLowerCase().includes(q) ||
      course?.code?.toLowerCase().includes(q) ||
      course?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-gray-500 mt-1">
          {sections.length} section{sections.length !== 1 ? 's' : ''} you teach
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by course code, title, room..."
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={40} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No classes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => {
            const course = getCourse(s.courseId);
            return (
              <a
                key={s.id}
                href={`/teacher/classes/${s.id}`}
                className="card hover:shadow-md transition block"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <BookOpen size={20} />
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      s.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {course?.code || 'N/A'}
                </span>

                <h3 className="font-semibold text-lg mt-2">
                  {course?.title || `Course #${s.courseId}`}
                </h3>
                <p className="text-sm text-gray-500">
                  Section {s.sectionName}
                </p>

                <div className="text-sm text-gray-500 mt-3 space-y-2">
                  <p className="flex items-center gap-2">
                    <Clock size={14} /> {s.dayOfWeek} {s.startTime}–{s.endTime}
                  </p>
                  <p>Room: {s.room || 'TBA'}</p>
                  <p className="flex items-center gap-2">
                    <Users size={14} /> {s.enrolledCount}/{s.capacity} students
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}