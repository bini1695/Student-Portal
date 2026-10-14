'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ClipboardList, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SearchInput } from '@/components/ui/SearchInput';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    invoiceNumber: '',
    studentId: '',
    feeStructureId: '',
    amount: 0,
    discount: 0,
    totalDue: 0,
    issuedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
  });

  const load = async () => {
    try {
      const [iRes, sRes, fRes] = await Promise.all([
        api.get('/invoices').catch(() => ({ data: [] })),
        api.get('/students').catch(() => ({ data: [] })),
        api.get('/fees').catch(() => ({ data: [] })),
      ]);
      setInvoices(iRes.data || []);
      setStudents(sRes.data || []);
      setFees(fRes.data || []);
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

  const openCreate = () => {
    const now = new Date();
    const invoiceNum = `INV-${now.getFullYear()}-${String(Date.now()).slice(-6)}`;
    setForm({
      invoiceNumber: invoiceNum,
      studentId: '',
      feeStructureId: '',
      amount: 0,
      discount: 0,
      totalDue: 0,
      issuedDate: now.toISOString().split('T')[0],
      dueDate: '',
    });
    setShowModal(true);
  };

  const handleFeeChange = (feeId: string) => {
    const fee = fees.find((f) => f.id === Number(feeId));
    const amount = fee ? Number(fee.amount) : 0;
    setForm({
      ...form,
      feeStructureId: feeId,
      amount,
      totalDue: amount - form.discount,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/invoices', {
        invoiceNumber: form.invoiceNumber,
        studentId: Number(form.studentId),
        feeStructureId: form.feeStructureId ? Number(form.feeStructureId) : null,
        amount: Number(form.amount),
        discount: Number(form.discount),
        totalDue: Number(form.amount) - Number(form.discount),
        amountPaid: 0,
        status: 'unpaid',
        issuedDate: form.issuedDate,
        dueDate: form.dueDate || null,
      });
      toast.success('Invoice created');
      setShowModal(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/invoices/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = invoices.filter((i) => {
    const matchFilter = !filter || i.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      i.invoiceNumber?.toLowerCase().includes(q) ||
      getStudentName(i.studentId).toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-gray-500 mt-1">{invoices.length} invoices</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> New Invoice
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search invoices..." />
        </div>
        <select
          className="input md:w-52"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <ClipboardList className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No invoices found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="text-left py-3 px-3">Invoice #</th>
                <th className="text-left py-3 px-3">Student</th>
                <th className="text-left py-3 px-3">Issued</th>
                <th className="text-left py-3 px-3">Due</th>
                <th className="text-left py-3 px-3">Amount</th>
                <th className="text-left py-3 px-3">Paid</th>
                <th className="text-left py-3 px-3">Status</th>
                <th className="text-right py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono text-sm">{inv.invoiceNumber}</td>
                  <td className="py-3 px-3 font-medium">{getStudentName(inv.studentId)}</td>
                  <td className="py-3 px-3 text-sm">{inv.issuedDate}</td>
                  <td className="py-3 px-3 text-sm">{inv.dueDate || '—'}</td>
                  <td className="py-3 px-3 font-medium">${Number(inv.totalDue).toFixed(2)}</td>
                  <td className="py-3 px-3 text-green-600">${Number(inv.amountPaid).toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                      inv.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                      inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setDeleteId(inv.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
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
        title="New Invoice"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Invoice Number</label>
            <input
              className="input"
              value={form.invoiceNumber}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Student</label>
            <select
              className="input"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              required
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user?.fullName} ({s.studentCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Fee Structure</label>
            <select
              className="input"
              value={form.feeStructureId}
              onChange={(e) => handleFeeChange(e.target.value)}
            >
              <option value="">Select fee</option>
              {fees.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — ${Number(f.amount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
              <label className="label">Discount</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Due</span>
              <span className="font-bold text-blue-600">
                ${(Number(form.amount) - Number(form.discount)).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Issued Date</label>
              <input
                type="date"
                className="input"
                value={form.issuedDate}
                onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                className="input"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1">
              {saving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message="Are you sure?"
        loading={deleting}
      />
    </div>
  );
}