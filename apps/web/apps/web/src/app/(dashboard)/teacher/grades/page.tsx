'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function GradesPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/grades').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Grades</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'enrollmentId', label: 'Enrollment' },
            { key: 'midtermScore', label: 'Midterm' },
            { key: 'finalScore', label: 'Final' },
            { key: 'totalScore', label: 'Total' },
            { key: 'letterGrade', label: 'Grade' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}