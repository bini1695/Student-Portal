'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DollarSign, Plus, Trash2, Edit } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SearchInput } from '@/components/ui/SearchInput';

export default function FeeStructuresPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    amount: 0,
    dueDate: '',
    description: '',
  });

  const load = async () => {
    try {
      const r = await api.get('/fees');
      setFees(r.data || []);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', amount: 0, dueDate: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (f: any) => {
    setEditing(f);
    setForm({
      name: f.name,
      amount: Number(f.amount) || 0,
      dueDate: f.dueDate || '',
      description: f.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        dueDate: form.dueDate || null,
      };
      if (editing) {
        await api.patch(`/fees/${editing.id}`, payload);
        toast.success('Fee structure updated');
      } else {
        await api.post('/fees', payload);
        toast.success('Fee structure created');
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/fees/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = fees.filter(
    (f) => !search || f.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fee Structures</h1>
          <p className="text-gray-500 mt-1">{fees.length} fee plans</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Fee
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search fee structures..." />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <DollarSign className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No fee structures yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f) => (
            <div key={f.id} className="card hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <DollarSign size={24} />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(f)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => setDeleteId(f.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold mt-3">{f.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                ${Number(f.amount).toFixed(2)}
              </p>
              {f.dueDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Due: {new Date(f.dueDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {f.description || 'No description'}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Fee Structure' : 'Add Fee Structure'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tuition Fee 2025"
              required
            />
          </div>
          <div>
            <label className="label">Amount ($)</label>
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
            <label className="label">Due Date</label>
            <input
              type="date"
              className="input"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Fee Structure"
        message="Are you sure?"
        loading={deleting}
      />
    </div>
  );
}