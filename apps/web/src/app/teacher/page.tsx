'use client';
import { useEffect, useState } from 'react';
import {
  BookOpen, Users, Calendar, Award, ClipboardList, Clock,
  TrendingUp, FileText,
} from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, secRes, cRes, aRes] = await Promise.all([
          api.get('/dashboard/me'),
          api.get('/course-sections'),
          api.get('/courses'),
          api.get('/assignments').catch(() => ({ data: [] })),
        ]);
        setData(dashRes.data);
        setSections(secRes.data || []);
        setCourses(cRes.data || []);
        setAssignments(aRes.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getCourse = (id: number) => courses.find((c) => c.id === id);

  const totalStudents = sections.reduce(
    (sum, s) => sum + (s.enrolledCount || 0),
    0,
  );

  const cards = [
    {
      label: 'My Sections',
      value: sections.length,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Assignments',
      value: assignments.length,
      icon: ClipboardList,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Avg Attendance',
      value: '95%',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage your classes, grades, and students
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card flex items-center gap-4">
              <div className={`p-3 rounded-xl ${c.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? '—' : c.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a
          href="/teacher/classes"
          className="card hover:shadow-md transition text-center"
        >
          <BookOpen className="mx-auto text-blue-600 mb-2" size={24} />
          <p className="text-sm font-medium">My Classes</p>
        </a>
        <a
          href="/teacher/attendance"
          className="card hover:shadow-md transition text-center"
        >
          <Calendar className="mx-auto text-green-600 mb-2" size={24} />
          <p className="text-sm font-medium">Attendance</p>
        </a>
        <a
          href="/teacher/grades"
          className="card hover:shadow-md transition text-center"
        >
          <Award className="mx-auto text-yellow-600 mb-2" size={24} />
          <p className="text-sm font-medium">Grades</p>
        </a>
        <a
          href="/teacher/assignments"
          className="card hover:shadow-md transition text-center"
        >
          <ClipboardList className="mx-auto text-purple-600 mb-2" size={24} />
          <p className="text-sm font-medium">Assignments</p>
        </a>
      </div>

      {/* My Sections */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen size={20} /> My Sections
          </h2>
          <a
            href="/teacher/classes"
            className="text-sm text-blue-600 hover:underline"
          >
            View all →
          </a>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : sections.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No sections assigned yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.slice(0, 4).map((s) => {
              const course = getCourse(s.courseId);
              return (
                <a
                  key={s.id}
                  href={`/teacher/classes/${s.id}`}
                  className="border rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {course?.code || 'N/A'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {s.status}
                    </span>
                  </div>
                  <h3 className="font-semibold">
                    {course?.title || 'Course'} — Section {s.sectionName}
                  </h3>
                  <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <p className="flex items-center gap-2">
                      <Clock size={14} /> {s.dayOfWeek} {s.startTime}–{s.endTime}
                    </p>
                    <p>Room: {s.room || 'TBA'}</p>
                    <p>Enrolled: {s.enrolledCount}/{s.capacity}</p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}