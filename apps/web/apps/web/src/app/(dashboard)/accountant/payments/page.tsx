'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function PaymentsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/payments').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'amount', label: 'Amount' },
            { key: 'method', label: 'Method' },
            { key: 'referenceNo', label: 'Reference' },
            { key: 'paymentDate', label: 'Date' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}