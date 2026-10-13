'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then((r) => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'role',
      label: 'Role',
      render: (r: any) => <Badge color="blue">{r.role?.name}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (r: any) => <Badge color={r.status === 'active' ? 'green' : 'red'}>{r.status}</Badge>,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <div className="card">
        {loading ? <p>Loading...</p> : <Table columns={columns} data={users} />}
      </div>
    </div>
  );
}