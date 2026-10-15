'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Users, Trash2, Plus } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { SearchInput } from '@/components/ui/SearchInput';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', phone: '', roleId: 4,
  });

  const load = async () => {
    try {
      const [uRes, rRes] = await Promise.all([
        api.get('/users'),
        api.get('/roles'),
      ]);
      setUsers(uRes.data);
      setRoles(rRes.data);
      const studentRoleId = rRes.data.find((role: any) => role.name === 'student')?.id;
      if (studentRoleId) setForm((current) => ({ ...current, roleId: Number(studentRoleId) }));
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/users', {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone,
        roleId: Number(form.roleId),
      });
      toast.success('User created!');
      setShowModal(false);
      setForm({ email: '', password: '', fullName: '', phone: '', roleId: 4 });
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
      await api.delete(`/users/${deleteId}`);
      toast.success('User deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const updateUser = async (id: number, updates: { roleId?: number; status?: string }) => {
    setUpdatingId(id);
    try {
      await api.patch(`/users/${id}`, updates);
      toast.success('User updated.');
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not update user.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Users</h1>
          <p className="text-gray-500 mt-1">{users.length} users</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> Add User
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search users..." />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="text-left py-3 px-3">ID</th>
                <th className="text-left py-3 px-3">Name</th>
                <th className="text-left py-3 px-3">Email</th>
                <th className="text-left py-3 px-3">Phone</th>
                <th className="text-left py-3 px-3">Role</th>
                <th className="text-left py-3 px-3">Status</th>
                <th className="text-right py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 text-sm">#{u.id}</td>
                  <td className="py-3 px-3 font-medium">{u.fullName}</td>
                  <td className="py-3 px-3 text-sm text-gray-500">{u.email}</td>
                  <td className="py-3 px-3 text-sm text-gray-500">{u.phone || '—'}</td>
                  <td className="py-3 px-3">
                    <select
                      className="input py-1 text-xs"
                      value={u.roleId}
                      disabled={updatingId === u.id}
                      aria-label={`Role for ${u.fullName}`}
                      onChange={(event) => void updateUser(u.id, { roleId: Number(event.target.value) })}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.name.replaceAll('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      className="input py-1 text-xs"
                      value={u.status}
                      disabled={updatingId === u.id}
                      aria-label={`Status for ${u.fullName}`}
                      onChange={(event) => void updateUser(u.id, { status: event.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setDeleteId(u.id)}
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add User">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Role</label>
            <select
              className="input"
              value={form.roleId}
              onChange={(e) => setForm({ ...form, roleId: Number(e.target.value) })}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
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
        title="Delete User"
        message="Are you sure?"
        loading={deleting}
      />
    </div>
  );
}