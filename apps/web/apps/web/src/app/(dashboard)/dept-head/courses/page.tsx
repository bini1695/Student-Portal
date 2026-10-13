'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function CoursesPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/courses').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Department Courses</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'code', label: 'Code' },
            { key: 'title', label: 'Title' },
            { key: 'creditHours', label: 'Credits' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}