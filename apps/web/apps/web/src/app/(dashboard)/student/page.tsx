'use client';
import { useEffect, useState } from 'react';
import { BookOpen, DollarSign, Bell } from 'lucide-react';
import api from '@/lib/api';
import { StatCard } from '@/components/charts/StatCard';

export default function StudentPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/me').then((r) => setData(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Enrollments" value={data?.stats?.totalEnrollments ?? '—'} icon={BookOpen} color="blue" />
        <StatCard title="Balance" value={`$${data?.stats?.outstandingBalance ?? 0}`} icon={DollarSign} color="red" />
      </div>

      <div className="card mt-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Bell size={20} /> Recent Announcements
        </h2>
        {data?.recentAnnouncements?.length ? (
          <ul className="space-y-3">
            {data.recentAnnouncements.map((a: any) => (
              <li key={a.id} className="border-b pb-2">
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-gray-500">{a.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        )}
      </div>
    </div>
  );
}