'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function FeesPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/fees').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fee Structures</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'amount', label: 'Amount' },
            { key: 'dueDate', label: 'Due Date' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}