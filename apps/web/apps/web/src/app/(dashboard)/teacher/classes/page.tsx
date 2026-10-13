'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function ClassesPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/course-sections').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Classes</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'sectionName', label: 'Section' },
            { key: 'room', label: 'Room' },
            { key: 'dayOfWeek', label: 'Day' },
            { key: 'startTime', label: 'Start' },
            { key: 'endTime', label: 'End' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}
