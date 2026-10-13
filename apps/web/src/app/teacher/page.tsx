'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Users } from 'lucide-react';
import api from '@/lib/api';
import { StatCard } from '@/components/charts/StatCard';

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/me').then((r) => setData(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="My Sections" value={data?.stats?.totalSections ?? '—'} icon={BookOpen} color="blue" />
        <StatCard title="Total Students" value={data?.stats?.totalStudents ?? '—'} icon={Users} color="green" />
      </div>
    </div>
  );
}