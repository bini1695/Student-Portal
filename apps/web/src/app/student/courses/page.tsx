'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function StudentCoursesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments').then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      <div className="card">
        {loading ? <p>Loading...</p> : items.length === 0 ? (
          <p className="text-gray-500">No enrollments yet.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((e) => (
              <li key={e.id} className="border-b pb-2">
                Section #{e.courseSectionId} — {e.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}