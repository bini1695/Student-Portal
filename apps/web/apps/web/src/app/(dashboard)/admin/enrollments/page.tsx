'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export default function EnrollmentsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/enrollments').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Enrollments</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'studentId', label: 'Student ID' },
            { key: 'courseSectionId', label: 'Section ID' },
            {
              key: 'status',
              label: 'Status',
              render: (r: any) => <Badge color={r.status === 'approved' ? 'green' : 'yellow'}>{r.status}</Badge>,
            },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}