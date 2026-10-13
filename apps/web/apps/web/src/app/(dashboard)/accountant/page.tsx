'use client';
import { useEffect, useState } from 'react';
import { ClipboardList, DollarSign, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { StatCard } from '@/components/charts/StatCard';

export default function AccountantPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/me').then((r) => setStats(r.data.stats)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Accountant Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Invoices" value={stats?.totalInvoices ?? '—'} icon={ClipboardList} color="blue" />
        <StatCard title="Collected" value={`$${stats?.totalCollected ?? 0}`} icon={DollarSign} color="green" />
        <StatCard title="Outstanding" value={`$${stats?.outstanding ?? 0}`} icon={AlertCircle} color="red" />
      </div>
    </div>
  );
}