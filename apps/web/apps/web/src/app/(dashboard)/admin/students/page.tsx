'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function StudentsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/students').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Students</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'studentCode', label: 'Code' },
            { key: 'user', label: 'Name', render: (r: any) => r.user?.fullName },
            { key: 'gender', label: 'Gender' },
            { key: 'status', label: 'Status' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}