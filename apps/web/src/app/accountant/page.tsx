'use client';
import { useEffect, useState } from 'react';
import {
  ClipboardList, DollarSign, AlertCircle, TrendingUp, CheckCircle, FileText,
} from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function AccountantDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, iRes, pRes] = await Promise.all([
          api.get('/dashboard/me'),
          api.get('/invoices').catch(() => ({ data: [] })),
          api.get('/payments').catch(() => ({ data: [] })),
        ]);
        setStats(dashRes.data?.stats || {});
        setInvoices(iRes.data || []);
        setPayments(pRes.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalBilled = invoices.reduce((sum, i) => sum + Number(i.totalDue || 0), 0);
  const totalCollected = invoices.reduce((sum, i) => sum + Number(i.amountPaid || 0), 0);
  const outstanding = totalBilled - totalCollected;

  const cards = [
    { label: 'Total Invoices', value: invoices.length, icon: ClipboardList, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Billed', value: `$${totalBilled.toFixed(2)}`, icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
    { label: 'Total Collected', value: `$${totalCollected.toFixed(2)}`, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { label: 'Outstanding', value: `$${outstanding.toFixed(2)}`, icon: AlertCircle, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Accountant Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage fees, invoices, and payments
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/accountant/fee-structures" className="card hover:shadow-md transition text-center">
          <DollarSign className="mx-auto text-blue-600 mb-2" size={24} />
          <p className="text-sm font-medium">Fee Structures</p>
        </a>
        <a href="/accountant/invoices" className="card hover:shadow-md transition text-center">
          <ClipboardList className="mx-auto text-green-600 mb-2" size={24} />
          <p className="text-sm font-medium">Invoices</p>
        </a>
        <a href="/accountant/payments" className="card hover:shadow-md transition text-center">
          <DollarSign className="mx-auto text-yellow-600 mb-2" size={24} />
          <p className="text-sm font-medium">Payments</p>
        </a>
        <a href="/accountant/reports" className="card hover:shadow-md transition text-center">
          <TrendingUp className="mx-auto text-purple-600 mb-2" size={24} />
          <p className="text-sm font-medium">Reports</p>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ClipboardList size={20} /> Recent Invoices
            </h2>
            <a href="/accountant/invoices" className="text-sm text-blue-600 hover:underline">
              View all →
            </a>
          </div>
          {loading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : invoices.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No invoices yet</p>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-mono text-sm">{inv.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">Student #{inv.studentId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${Number(inv.totalDue).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                      inv.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign size={20} /> Recent Payments
            </h2>
            <a href="/accountant/payments" className="text-sm text-blue-600 hover:underline">
              View all →
            </a>
          </div>
          {loading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : payments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No payments yet</p>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-sm font-medium">Payment #{p.id}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {p.method?.replace('_', ' ')}
                    </p>
                  </div>
                  <p className="font-bold text-green-600">
                    +${Number(p.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}