'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

interface CourseSection {
  id: number;
  courseId: number;
  sectionName: string;
  semesterId: number;
  room: string | null;
  dayOfWeek: string | null;
  startTime: string | null;
  endTime: string | null;
  capacity: number;
  enrolledCount: number;
  status: 'open' | 'closed' | 'cancelled';
}

interface Enrollment {
  id: number;
  courseSectionId: number;
  status: 'pending' | 'approved' | 'rejected' | 'dropped' | 'completed';
  enrolledAt: string;
}

function messageFrom(error: unknown) {
  return axios.isAxiosError(error)
    ? error.response?.data?.message ?? error.message
    : 'Unable to load enrollment information.';
}

export function StudentEnrollmentWorkspace() {
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sectionsResponse, enrollmentsResponse] = await Promise.all([
        api.get<CourseSection[]>('/course-sections'),
        api.get<Enrollment[]>('/enrollments'),
      ]);
      setSections(sectionsResponse.data);
      setEnrollments(enrollmentsResponse.data);
    } catch (loadError: unknown) {
      setError(messageFrom(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const activeSectionIds = new Set(
    enrollments
      .filter(({ status }) => status === 'pending' || status === 'approved')
      .map(({ courseSectionId }) => courseSectionId),
  );
  const availableSections = sections.filter(
    (section) =>
      section.status === 'open' &&
      section.enrolledCount < section.capacity &&
      !activeSectionIds.has(section.id),
  );

  async function enroll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSectionId) {
      setError('Select an open course section.');
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await api.post('/enrollments', { courseSectionId: Number(selectedSectionId) });
      setSelectedSectionId('');
      setNotice('Enrollment request submitted. It will appear as pending until reviewed.');
      await load();
    } catch (submitError: unknown) {
      setError(messageFrom(submitError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Course enrollment</h1>
        <p className="mt-1 text-sm text-gray-500">Request a place in an open section and track its approval status.</p>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : (
        <>
          <form onSubmit={(event) => void enroll(event)} className="card space-y-3">
            <label className="block text-sm font-medium">
              Open course section
              <select
                className="input mt-1 w-full"
                value={selectedSectionId}
                onChange={(event) => setSelectedSectionId(event.target.value)}
                required
              >
                <option value="">Select a section</option>
                {availableSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    Course #{section.courseId} · Section {section.sectionName} · {section.dayOfWeek ?? 'Schedule TBD'} {section.startTime ?? ''}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn-primary" disabled={saving || availableSections.length === 0}>
              {saving ? 'Submitting…' : 'Request enrollment'}
            </button>
            {availableSections.length === 0 && <p className="text-sm text-gray-500">There are no eligible open sections right now.</p>}
          </form>

          <div className="card overflow-x-auto">
            <h2 className="mb-4 text-lg font-semibold">My enrollment requests</h2>
            {enrollments.length === 0 ? (
              <p className="text-sm text-gray-500">You have not requested any enrollments yet.</p>
            ) : (
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead><tr className="border-b text-gray-500"><th className="p-2">Course section</th><th className="p-2">Requested</th><th className="p-2">Status</th></tr></thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b last:border-0">
                      <td className="p-2">#{enrollment.courseSectionId}</td>
                      <td className="p-2">{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                      <td className="p-2 capitalize">{enrollment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </section>
  );
}
