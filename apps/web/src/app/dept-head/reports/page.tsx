'use client';
import { useEffect, useState } from 'react';
import {
  TrendingUp, Users, GraduationCap, BookOpen, Layers, Award,
} from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function DeptHeadReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/me').then((r) => setStats(r.data?.stats || {})).catch(() => ({})),
      api.get('/courses').then((r) => setCourses(r.data || [])).catch(() => []),
      api.get('/teachers').then((r) => setTeachers(r.data || [])).catch(() => []),
      api.get('/students').then((r) => setStudents(r.data || [])).catch(() => []),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  const totalCredits = courses.reduce((sum, c) => sum + (c.creditHours || 0), 0);

  const cards = [
    { label: 'Total Teachers', value: teachers.length, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Students', value: students.length, icon: GraduationCap, color: 'bg-green-100 text-green-600' },
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Total Credits', value: totalCredits, icon: Award, color: 'bg-purple-100 text-purple-600' },
  ];

  const activeStudents = students.filter((s) => s.status === 'active').length;
  const activeTeachers = teachers.filter((t) => t.status === 'active').length;
  const activeCourses = courses.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Department Reports</h1>
        <p className="text-gray-500 mt-1">Overview of your department's performance</p>
      </div>

      {/* Stats Grid */}
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
                <p className="text-2xl font-bold">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <GraduationCap size={18} className="text-green-600" /> Students Overview
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Active</span>
              <span className="font-bold text-green-600">{activeStudents}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold">{students.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${students.length > 0 ? (activeStudents / students.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users size={18} className="text-blue-600" /> Teachers Overview
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Active</span>
              <span className="font-bold text-blue-600">{activeTeachers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold">{teachers.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${teachers.length > 0 ? (activeTeachers / teachers.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen size={18} className="text-yellow-600" /> Courses Overview
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Active</span>
              <span className="font-bold text-yellow-600">{activeCourses}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold">{courses.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{
                  width: `${courses.length > 0 ? (activeCourses / courses.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} /> Department Performance Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {teachers.length > 0 && students.length > 0
                ? (students.length / teachers.length).toFixed(1)
                : '0'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Students per Teacher</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {courses.length > 0 && teachers.length > 0
                ? (courses.length / teachers.length).toFixed(1)
                : '0'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Courses per Teacher</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {courses.length > 0 ? (totalCredits / courses.length).toFixed(1) : '0'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Avg Credits / Course</p>
          </div>
        </div>
      </div>
    </div>
  );
}