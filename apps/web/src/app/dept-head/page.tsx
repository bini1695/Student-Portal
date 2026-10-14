'use client';
import { useEffect, useState } from 'react';
import {
  Users, GraduationCap, BookOpen, TrendingUp, Layers, Award,
  Building2, AlertCircle,
} from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function DeptHeadDashboard() {
  const [data, setData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, cRes, tRes] = await Promise.all([
          api.get('/dashboard/me'),
          api.get('/courses'),
          api.get('/teachers'),
        ]);
        setData(dashRes.data || {});
        setCourses(cRes.data || []);
        setTeachers(tRes.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = data?.stats || {};
  const deptName = data?.department?.name;

  const cards = [
    { label: 'Teachers', value: stats.teachers ?? teachers.length, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Students', value: stats.students ?? 0, icon: GraduationCap, color: 'bg-green-100 text-green-600' },
    { label: 'Courses', value: stats.courses ?? courses.length, icon: BookOpen, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Sections', value: stats.sections ?? 0, icon: Layers, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Department Head Dashboard
            {deptName && (
              <span className="text-lg text-gray-500 font-normal ml-2">
                — {deptName}
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your department's courses, teachers, and students
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Warning if no department linked */}
      {!loading && !deptName && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium">No department linked</p>
            <p className="text-sm mt-1">
              Contact the Super Admin to link your account to a department.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card flex items-center gap-4 hover:shadow-md transition">
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
        <a href="/dept-head/courses" className="card hover:shadow-md transition text-center">
          <BookOpen className="mx-auto text-blue-600 mb-2" size={24} />
          <p className="text-sm font-medium">Courses</p>
        </a>
        <a href="/dept-head/teachers" className="card hover:shadow-md transition text-center">
          <Users className="mx-auto text-green-600 mb-2" size={24} />
          <p className="text-sm font-medium">Teachers</p>
        </a>
        <a href="/dept-head/students" className="card hover:shadow-md transition text-center">
          <GraduationCap className="mx-auto text-yellow-600 mb-2" size={24} />
          <p className="text-sm font-medium">Students</p>
        </a>
        <a href="/dept-head/reports" className="card hover:shadow-md transition text-center">
          <TrendingUp className="mx-auto text-purple-600 mb-2" size={24} />
          <p className="text-sm font-medium">Reports</p>
        </a>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Courses */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen size={20} /> Department Courses
            </h2>
            <a href="/dept-head/courses" className="text-sm text-blue-600 hover:underline">
              View all →
            </a>
          </div>
          {loading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : courses.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No courses yet</p>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 5).map((c) => (
                <div key={c.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {c.code}
                    </span>
                    <span className="text-xs text-gray-500">{c.creditHours} cr</span>
                  </div>
                  <h3 className="font-semibold mt-2 text-sm">{c.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Teachers */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users size={20} /> Teachers
            </h2>
            <a href="/dept-head/teachers" className="text-sm text-blue-600 hover:underline">
              View all →
            </a>
          </div>
          {loading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : teachers.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No teachers yet</p>
          ) : (
            <div className="space-y-3">
              {teachers.slice(0, 5).map((t) => (
                <div key={t.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <h3 className="font-semibold text-sm">{t.user?.fullName || 'Unknown'}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t.user?.email || '—'}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.specialization || 'No specialization'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}