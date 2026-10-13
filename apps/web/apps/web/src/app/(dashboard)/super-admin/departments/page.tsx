'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function DepartmentsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/departments').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Departments</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'code', label: 'Code' },
            { key: 'description', label: 'Description' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}