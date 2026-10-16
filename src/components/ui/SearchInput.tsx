'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, BookOpen, Edit } from 'lucide-react';
import api from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';
import { SearchInput } from '@/components/ui/SearchInput';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    code: '',
    title: '',
    description: '',
    departmentId: '',
    creditHours: 3,
    level: 1,
  });

  const load = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', title: '', description: '', departmentId: '', creditHours: 3, level: 1 });
    setShowModal(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      code: c.code,
      title: c.title,
      description: c.description || '',
      departmentId: String(c.departmentId || ''),
      creditHours: c.creditHours,
      level: c.level,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        creditHours: Number(form.creditHours),
        level: Number(form.level),
      };
      if (editing) {
        await api.patch(`/courses/${editing.id}`, payload);
        toast.success('Course updated!');
      } else {
        await api.post('/courses', payload);
        toast.success('Course created!');
      }
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
      await api.delete(`/courses/${deleteId}`);
      toast.success('Course deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-gray-500 mt-1">Manage course catalog</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Course
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search courses..." />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No courses yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="card hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {c.code}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(c.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold mt-3">{c.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {c.description || 'No description'}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                <span>{c.creditHours} credits</span>
                <span>Level {c.level}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Course' : 'Add Course'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Course Code</label>
            <input
              className="input"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="CS101"
              required
            />
          </div>
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Department ID</label>
              <input
                type="number"
                className="input"
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Credits</label>
              <input
                type="number"
                className="input"
                value={form.creditHours}
                onChange={(e) => setForm({ ...form, creditHours: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <label className="label">Level</label>
            <input
              type="number"
              className="input"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
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
        title="Delete Course"
        message="Are you sure you want to delete this course?"
        loading={deleting}
      />
    </div>
  );
}