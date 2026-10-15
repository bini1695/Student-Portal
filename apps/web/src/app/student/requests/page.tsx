'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FileText, Plus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: 'transcript',
    description: '',
  });

  const load = async () => {
    try {
      const r = await api.get('/requests');
      setRequests(r.data || []);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/requests', {
        studentId: 1,
        type: form.type,
        description: form.description,
        status: 'pending',
      });
      toast.success('Request submitted!');
      setShowModal(false);
      setForm({ type: 'transcript', description: '' });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle size={12} /> Approved
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
          <XCircle size={12} /> Rejected
        </span>
      );
    }
    return (
      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
        <Clock size={12} /> Pending
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Requests</h1>
          <p className="text-gray-500 mt-1">
            Transcripts, certificates, and other requests
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No requests yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary mt-4"
          >
            Submit First Request
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">
                      {r.type.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {r.description || 'No description'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {getStatusBadge(r.status)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="New Request"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Request Type</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            >
              <option value="transcript">Transcript</option>
              <option value="certificate">Certificate</option>
              <option value="leave">Leave</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe your request..."
              required
            />
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
              {saving ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}