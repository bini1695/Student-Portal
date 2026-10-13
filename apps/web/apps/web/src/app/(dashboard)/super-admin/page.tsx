'use client';
import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, Building2, Layers, Bell } from 'lucide-react';
import api from '@/lib/api';
import { StatCard } from '@/components/charts/StatCard';

export default function SuperAdminPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/me').then((r) => setStats(r.data.stats)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers ?? '—'} icon={Users} color="blue" />
        <StatCard title="Students" value={stats?.totalStudents ?? '—'} icon={GraduationCap} color="green" />
        <StatCard title="Teachers" value={stats?.totalTeachers ?? '—'} icon={Users} color="purple" />
        <StatCard title="Courses" value={stats?.totalCourses ?? '—'} icon={BookOpen} color="yellow" />
        <StatCard title="Departments" value={stats?.totalDepartments ?? '—'} icon={Building2} color="red" />
        <StatCard title="Sections" value={stats?.totalSections ?? '—'} icon={Layers} color="blue" />
      </div>
    </div>
  );
}