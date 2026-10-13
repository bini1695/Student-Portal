'use client';
import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, ClipboardList } from 'lucide-react';
import api from '@/lib/api';
import { StatCard } from '@/components/charts/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/me').then((r) => setStats(r.data.stats)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Students" value={stats?.totalStudents ?? '—'} icon={GraduationCap} color="green" />
        <StatCard title="Teachers" value={stats?.totalTeachers ?? '—'} icon={Users} color="blue" />
        <StatCard title="Courses" value={stats?.totalCourses ?? '—'} icon={BookOpen} color="yellow" />
        <StatCard title="Pending Enrollments" value={stats?.pendingEnrollments ?? '—'} icon={ClipboardList} color="red" />
      </div>
    </div>
  );
}