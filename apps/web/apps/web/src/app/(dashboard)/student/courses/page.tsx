'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function MyCoursesPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/enrollments').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'courseSectionId', label: 'Section' },
            { key: 'semesterId', label: 'Semester' },
            { key: 'status', label: 'Status' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}