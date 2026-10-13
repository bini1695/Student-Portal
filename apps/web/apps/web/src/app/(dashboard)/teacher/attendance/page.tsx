'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';

export default function AttendancePage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get('/attendance').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Attendance</h1>
      <div className="card">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'studentId', label: 'Student' },
            { key: 'attendanceDate', label: 'Date' },
            { key: 'status', label: 'Status' },
          ]}
          data={items}
        />
      </div>
    </div>
  );
}