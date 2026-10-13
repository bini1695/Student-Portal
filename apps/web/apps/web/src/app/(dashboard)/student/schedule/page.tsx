'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function SchedulePage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/course-sections').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'sectionName', label: 'Section' },
            { key: 'dayOfWeek', label: 'Day' },
            { key: 'startTime', label: 'Start' },
            { key: 'endTime', label: 'End' },
            { key: 'room', label: 'Room' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}