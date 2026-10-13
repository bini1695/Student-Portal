'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function TeachersPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/teachers').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teachers</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'teacherCode', label: 'Code' },
            { key: 'user', label: 'Name', render: (r: any) => r.user?.fullName },
            { key: 'qualification', label: 'Qualification' },
            { key: 'specialization', label: 'Specialization' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}