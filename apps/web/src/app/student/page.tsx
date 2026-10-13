'use client';
import { useEffect, useState } from 'react';
import { BookOpen, DollarSign, Bell } from 'lucide-react';
import api from '@/lib/api';
import { StatCard } from '@/components/charts/StatCard';

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/me').then((r) => setData(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Enrollments" value={data?.stats?.totalEnrollments ?? '—'} icon={BookOpen} color="blue" />
        <StatCard title="Balance" value={`$${data?.stats?.outstandingBalance ?? 0}`} icon={DollarSign} color="red" />
        <StatCard title="Announcements" value={data?.recentAnnouncements?.length ?? 0} icon={Bell} color="yellow" />
      </div>
    </div>
  );
}