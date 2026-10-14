'use client';
import { useEffect, useState } from 'react';
import { GraduationCap, Mail, User } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { SearchInput } from '@/components/ui/SearchInput';

export default function DeptHeadStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/students')
      .then((r) => setStudents(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      !search ||
      s.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Department Students</h1>
        <p className="text-gray-500 mt-1">{students.length} students</p>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search students..." />

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <GraduationCap className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="text-left py-3 px-3">Code</th>
                <th className="text-left py-3 px-3">Name</th>
                <th className="text-left py-3 px-3">Email</th>
                <th className="text-left py-3 px-3">Gender</th>
                <th className="text-left py-3 px-3">Semester</th>
                <th className="text-left py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono text-sm">{s.studentCode}</td>
                  <td className="py-3 px-3 font-medium">
                    <span className="flex items-center gap-1">
                      <User size={14} /> {s.user?.fullName || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {s.user?.email || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-sm capitalize">{s.gender || '—'}</td>
                  <td className="py-3 px-3 text-sm">{s.currentSemester || 1}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}