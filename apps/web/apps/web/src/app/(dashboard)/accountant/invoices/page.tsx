'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export default function InvoicesPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/invoices').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'invoiceNumber', label: 'Number' },
            { key: 'totalDue', label: 'Due' },
            { key: 'amountPaid', label: 'Paid' },
            {
              key: 'status',
              label: 'Status',
              render: (r: any) => <Badge color={r.status === 'paid' ? 'green' : 'yellow'}>{r.status}</Badge>,
            },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}