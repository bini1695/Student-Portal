'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function MyGradesPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/grades').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Grades</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'totalScore', label: 'Score' },
            { key: 'letterGrade', label: 'Grade' },
            { key: 'gradePoint', label: 'GPA' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}