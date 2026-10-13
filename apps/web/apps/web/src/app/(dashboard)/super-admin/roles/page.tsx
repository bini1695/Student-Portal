'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    api.get('/roles').then((r) => setRoles(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Roles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r) => (
          <Card key={r.id}>
            <h3 className="font-semibold">{r.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{r.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}