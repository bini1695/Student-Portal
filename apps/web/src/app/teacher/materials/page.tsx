'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FileText, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import api from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
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
    filePath: '',
    fileType: 'pdf',
  });

  const load = async () => {
    try {
      const [mRes, sRes, cRes] = await Promise.all([
        api.get('/course-materials'),
        api.get('/course-sections'),
        api.get('/courses'),
      ]);
      setMaterials(mRes.data || []);
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
      await api.post('/course-materials', {
        courseSectionId: Number(form.courseSectionId),
        title: form.title,
        description: form.description,
        filePath: form.filePath,
        fileType: form.fileType,
      });
      toast.success('Material added!');
      setShowModal(false);
      setForm({
        courseSectionId: '',
        title: '',
        description: '',
        filePath: '',
        fileType: 'pdf',
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
      await api.delete(`/course-materials/${deleteId}`);
      toast.success('Material deleted');
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
          <h1 className="text-3xl font-bold">Course Materials</h1>
          <p className="text-gray-500 mt-1">
            {materials.length} materials uploaded
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Material
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={40} />
        </div>
      ) : materials.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No materials uploaded yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary mt-4"
          >
            Upload First Material
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <div key={m.id} className="card hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <FileText size={24} />
                </div>
                <button
                  onClick={() => setDeleteId(m.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="font-semibold mt-3">{m.title}</h3>
              <p className="text-xs text-gray-400">
                {getSectionName(m.courseSectionId)}
              </p>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {m.description || 'No description'}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {m.fileType || 'file'}
                </span>
                {m.filePath && (
                  <a
                    href={m.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-xs hover:underline flex items-center gap-1"
                  >
                    <LinkIcon size={12} /> Open
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add Material"
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

          <div>
            <label className="label">File URL / Path</label>
            <input
              className="input"
              value={form.filePath}
              onChange={(e) => setForm({ ...form, filePath: e.target.value })}
              placeholder="https://example.com/lecture1.pdf"
              required
            />
          </div>

          <div>
            <label className="label">File Type</label>
            <select
              className="input"
              value={form.fileType}
              onChange={(e) => setForm({ ...form, fileType: e.target.value })}
            >
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
              <option value="pptx">PPTX</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
            </select>
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
              {saving ? 'Adding...' : 'Add Material'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Material"
        message="Are you sure?"
        loading={deleting}
      />
    </div>
  );
}