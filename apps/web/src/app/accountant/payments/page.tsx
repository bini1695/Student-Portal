'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DollarSign, Plus, Search } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    invoiceId: '',
    studentId: '',
    amount: 0,
    method: 'cash',
    referenceNo: '',
    notes: '',
  });

  const load = async () => {
    try {
      const [pRes, iRes, sRes] = await Promise.all([
        api.get('/payments').catch(() => ({ data: [] })),
        api.get('/invoices').catch(() => ({ data: [] })),
        api.get('/students').catch(() => ({ data: [] })),
      ]);
      setPayments(pRes.data || []);
      setInvoices(iRes.data || []);
      setStudents(sRes.data || []);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getStudentName = (id: number) => {
    const s = students.find((x) => x.id === id);
    return s?.user?.fullName || `Student #${id}`;
  };

  const handleInvoiceChange = (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === Number(invoiceId));
    if (inv) {
      const balance = Number(inv.totalDue) - Number(inv.amountPaid);
      setForm({
        ...form,
        invoiceId,
        studentId: String(inv.studentId),
        amount: balance,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/payments', {
        invoiceId: Number(form.invoiceId),
        studentId: Number(form.studentId),
        amount: Number(form.amount),
        method: form.method,
        referenceNo: form.referenceNo,
        notes: form.notes,
      });

      // Update invoice
      const inv = invoices.find((i) => i.id === Number(form.invoiceId));
      if (inv) {
        const newPaid = Number(inv.amountPaid) + Number(form.amount);
        const newStatus = newPaid >= Number(inv.totalDue) ? 'paid' : 'partial';
        await api.patch(`/invoices/${inv.id}`, {
          amountPaid: newPaid,
          status: newStatus,
        }).catch(() => null);
      }

      toast.success('Payment recorded');
      setShowModal(false);
      setForm({
        invoiceId: '', studentId: '', amount: 0,
        method: 'cash', referenceNo: '', notes: '',
      });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const filtered = payments.filter(
    (p) =>
      !search ||
      getStudentName(p.studentId).toLowerCase().includes(search.toLowerCase()) ||
      p.referenceNo?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalCollected = payments.reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-500 mt-1">
            {payments.length} payments — Total: ${totalCollected.toFixed(2)}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> Record Payment
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search payments..." />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <DollarSign className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No payments yet</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="text-left py-3 px-3">ID</th>
                <th className="text-left py-3 px-3">Student</th>
                <th className="text-left py-3 px-3">Invoice</th>
                <th className="text-left py-3 px-3">Amount</th>
                <th className="text-left py-3 px-3">Method</th>
                <th className="text-left py-3 px-3">Reference</th>
                <th className="text-left py-3 px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 text-sm">#{p.id}</td>
                  <td className="py-3 px-3 font-medium">{getStudentName(p.studentId)}</td>
                  <td className="py-3 px-3 text-sm">#{p.invoiceId}</td>
                  <td className="py-3 px-3 font-bold text-green-600">
                    +${Number(p.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-sm capitalize">
                    {p.method?.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-3 text-sm font-mono text-gray-500">
                    {p.referenceNo || '—'}
                  </td>
                  <td className="py-3 px-3 text-sm">
                    {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Record Payment"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Invoice</label>
            <select
              className="input"
              value={form.invoiceId}
              onChange={(e) => handleInvoiceChange(e.target.value)}
              required
            >
              <option value="">Select invoice</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {getStudentName(inv.studentId)} — Balance: ${(Number(inv.totalDue) - Number(inv.amountPaid)).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Amount</label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              required
            />
          </div>

          <div>
            <label className="label">Payment Method</label>
            <select
              className="input"
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>

          <div>
            <label className="label">Reference Number</label>
            <input
              className="input"
              value={form.referenceNo}
              onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
              placeholder="TXN-123456"
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              className="input"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1">
              {saving ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}