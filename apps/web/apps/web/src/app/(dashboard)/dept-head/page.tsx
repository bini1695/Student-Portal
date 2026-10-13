'use client';
import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen } from 'lucide-react';
import api from '@/lib/api';
import { StatCard } from '@/components/charts/StatCard';

export default function DeptHeadPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/me').then((r) => setData(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Department Head {data?.department?.name ? `— ${data.department.name}` : ''}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Teachers" value={data?.stats?.teachers ?? '—'} icon={Users} color="blue" />
        <StatCard title="Students" value={data?.stats?.students ?? '—'} icon={GraduationCap} color="green" />
        <StatCard title="Courses" value={data?.stats?.courses ?? '—'} icon={BookOpen} color="yellow" />
      </div>
    </div>
  );
}