'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Pencil, Plus, Receipt, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { Spinner } from '@/components/ui/Spinner';
import api from '@/lib/api';

interface FeeStructure {
  id: number;
  name: string;
  departmentId: number | null;
  semesterId: number | null;
  amount: number | string;
  dueDate: string | null;
  description: string | null;
}

interface FeeForm {
  name: string;
  departmentId: string;
  semesterId: string;
  amount: string;
  dueDate: string;
  description: string;
}

const emptyForm: FeeForm = {
  name: '',
  departmentId: '',
  semesterId: '',
  amount: '',
  dueDate: '',
  description: '',
};

const formatCurrency = (amount: number | string) =>
  `$${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function FeeStructuresPage() {
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<FeeStructure | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<FeeForm>(emptyForm);

  const loadFees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<FeeStructure[]>('/fees');
      setFees(response.data);
    } catch {
      toast.error('Unable to load fee structures. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFees();
  }, [loadFees]);

  const filteredFees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return fees;
    return fees.filter((fee) =>
      fee.name.toLowerCase().includes(query) ||
      fee.description?.toLowerCase().includes(query),
    );
  }, [fees, search]);

  const openCreateForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (fee: FeeStructure) => {
    setEditing(fee);
    setForm({
      name: fee.name,
      departmentId: fee.departmentId == null ? '' : String(fee.departmentId),
      semesterId: fee.semesterId == null ? '' : String(fee.semesterId),
      amount: String(fee.amount),
      dueDate: fee.dueDate?.slice(0, 10) || '',
      description: fee.description || '',
    });
    setShowForm(true);
  };

  const saveFee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      departmentId: form.departmentId ? Number(form.departmentId) : null,
      semesterId: form.semesterId ? Number(form.semesterId) : null,
      amount: Number(form.amount),
      dueDate: form.dueDate || null,
      description: form.description.trim() || null,
    };

    try {
      if (editing) {
        await api.patch(`/fees/${editing.id}`, payload);
        toast.success('Fee structure updated.');
      } else {
        await api.post('/fees', payload);
        toast.success('Fee structure created.');
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      await loadFees();
    } catch {
      toast.error(`Unable to ${editing ? 'update' : 'create'} fee structure.`);
    } finally {
      setSaving(false);
    }
  };

  const deleteFee = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await api.delete(`/fees/${deleteId}`);
      toast.success('Fee structure deleted.');
      setDeleteId(null);
      await loadFees();
    } catch {
      toast.error('Unable to delete fee structure.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Fee Structures</h1>
          <p className="mt-1 text-gray-500">{fees.length} fee structures</p>
        </div>
        <button type="button" onClick={openCreateForm} className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> Add fee structure
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search fee structures..." />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : filteredFees.length === 0 ? (
        <div className="card py-12 text-center">
          <Receipt className="mx-auto mb-3 text-gray-300" size={44} />
          <p className="text-gray-600">{search ? 'No matching fee structures.' : 'No fee structures yet.'}</p>
          {!search && (
            <button type="button" onClick={openCreateForm} className="btn btn-primary mt-4">
              Create the first fee structure
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[700px]">
            <thead className="border-b text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Due date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{fee.name}</p>
                    {fee.description && <p className="mt-1 max-w-xs truncate text-sm text-gray-500">{fee.description}</p>}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(fee.amount)}</td>
                  <td className="px-4 py-3 text-gray-600">{fee.departmentId ?? 'All departments'}</td>
                  <td className="px-4 py-3 text-gray-600">{fee.semesterId ?? 'All semesters'}</td>
                  <td className="px-4 py-3 text-gray-600">{fee.dueDate?.slice(0, 10) || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Edit ${fee.name}`}
                      onClick={() => openEditForm(fee)}
                      className="rounded p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${fee.name}`}
                      onClick={() => setDeleteId(fee.id)}
                      className="rounded p-2 text-red-600 hover:bg-red-50"
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
        open={showForm}
        onClose={() => {
          if (!saving) setShowForm(false);
        }}
        title={editing ? 'Edit fee structure' : 'Create fee structure'}
      >
        <form onSubmit={saveFee} className="space-y-4">
          <div>
            <label htmlFor="fee-name" className="label">Name</label>
            <input id="fee-name" className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength={150} />
          </div>
          <div>
            <label htmlFor="fee-amount" className="label">Amount</label>
            <input id="fee-amount" type="number" min="0" step="0.01" className="input" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fee-department" className="label">Department ID (optional)</label>
              <input id="fee-department" type="number" min="1" className="input" value={form.departmentId} onChange={(event) => setForm({ ...form, departmentId: event.target.value })} />
            </div>
            <div>
              <label htmlFor="fee-semester" className="label">Semester ID (optional)</label>
              <input id="fee-semester" type="number" min="1" className="input" value={form.semesterId} onChange={(event) => setForm({ ...form, semesterId: event.target.value })} />
            </div>
          </div>
          <div>
            <label htmlFor="fee-due-date" className="label">Due date (optional)</label>
            <input id="fee-due-date" type="date" className="input" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
          </div>
          <div>
            <label htmlFor="fee-description" className="label">Description (optional)</label>
            <textarea id="fee-description" className="input min-h-24" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} disabled={saving} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => void deleteFee()}
        title="Delete fee structure"
        message="This will permanently remove the fee structure. Continue?"
        loading={deleting}
      />
    </div>
  );
}
