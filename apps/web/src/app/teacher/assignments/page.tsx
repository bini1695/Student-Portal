'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, ClipboardList, Calendar, Award } from 'lucide-react';
import api from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    courseSectionId: '',
    title: '',
    description: '',
    maxScore: 100,
    dueDate: '',
  });

  const load = async () => {
    try {
      const [aRes, sRes, cRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/course-sections'),
        api.get('/courses'),
      ]);
      setAssignments(aRes.data || []);
      setSections(sRes.data || []);
      setCourses(cRes.data || []);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getSectionName = (id: number) => {
    const s = sections.find((x) => x.id === id);
    if (!s) return `Section #${id}`;
    const c = courses.find((x) => x.id === s.courseId);
    return `${c?.code || 'Course'} — Section ${s.sectionName}`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/assignments', {
        courseSectionId: Number(form.courseSectionId),
        title: form.title,
        description: form.description,
        maxScore: Number(form.maxScore),
        dueDate: form.dueDate || null,
      });
      toast.success('Assignment created!');
      setShowModal(false);
      setForm({
        courseSectionId: '',
        title: '',
        description: '',
        maxScore: 100,
        dueDate: '',
      });
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
      await api.delete(`/assignments/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-gray-500 mt-1">{assignments.length} total assignments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Assignment
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={40} />
        </div>
      ) : assignments.length === 0 ? (
        <div className="card text-center py-12">
          <ClipboardList className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No assignments yet</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary mt-4">
            Create First Assignment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((a) => (
            <div key={a.id} className="card hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <ClipboardList size={20} />
                </div>
                <button
                  onClick={() => setDeleteId(a.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="font-semibold mt-3">{a.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {a.description || 'No description'}
              </p>

              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <p className="flex items-center gap-1">
                  <ClipboardList size={12} /> {getSectionName(a.courseSectionId)}
                </p>
                <p className="flex items-center gap-1">
                  <Award size={12} /> Max: {a.maxScore} points
                </p>
                {a.dueDate && (
                  <p className="flex items-center gap-1">
                    <Calendar size={12} /> Due:{' '}
                    {new Date(a.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <a
                href={`/teacher/assignments/${a.id}`}
                className="text-blue-600 text-sm hover:underline mt-3 inline-block"
              >
                View submissions →
              </a>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="New Assignment"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Section</label>
            <select
              className="input"
              value={form.courseSectionId}
              onChange={(e) =>
                setForm({ ...form, courseSectionId: e.target.value })
              }
              required
            >
              <option value="">Select section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {getSectionName(s.id)}
                </option>
              ))}
            </select>
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
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Max Score</label>
              <input
                type="number"
                className="input"
                value={form.maxScore}
                onChange={(e) =>
                  setForm({ ...form, maxScore: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="label">Due Date</label>
              <input
                type="datetime-local"
                className="input"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex-1"
            >
              {saving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        message="Are you sure?"
        loading={deleting}
      />
    </div>
  );
}