'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function EnrollPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/course-sections').then((r) => setSections(r.data)).catch(() => {});
  }, []);

  const enroll = async (sectionId: number) => {
    try {
      await api.post('/enrollments', { courseSectionId: sectionId, status: 'pending' });
      setMsg('Enrollment submitted!');
    } catch {
      setMsg('Enrollment failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Enroll in a Course</h1>
      {msg && <div className="mb-4 bg-blue-50 text-blue-700 p-3 rounded">{msg}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Card key={s.id}>
            <h3 className="font-semibold">Section {s.sectionName}</h3>
            <p className="text-sm text-gray-500 mt-1">{s.room || 'No room'}</p>
            <p className="text-sm text-gray-500">{s.dayOfWeek} {s.startTime}-{s.endTime}</p>
            <Button onClick={() => enroll(s.id)} className="mt-3 w-full">
              Enroll
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}