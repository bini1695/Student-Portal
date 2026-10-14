'use client';
import { useEffect, useState } from 'react';
import { Users, Mail, Award } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { SearchInput } from '@/components/ui/SearchInput';

export default function DeptHeadTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/teachers')
      .then((r) => setTeachers(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = teachers.filter(
    (t) =>
      !search ||
      t.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      t.teacherCode?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Department Teachers</h1>
        <p className="text-gray-500 mt-1">{teachers.length} teachers</p>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search teachers..." />

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No teachers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="card hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <Users size={24} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                }`}>
                  {t.status}
                </span>
              </div>

              <h3 className="font-semibold text-lg mt-3">
                {t.user?.fullName || 'Unknown'}
              </h3>
              <p className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block mt-1">
                {t.teacherCode}
              </p>

              <div className="mt-3 space-y-2 text-sm text-gray-500">
                {t.user?.email && (
                  <p className="flex items-center gap-2">
                    <Mail size={14} /> {t.user.email}
                  </p>
                )}
                {t.qualification && (
                  <p className="flex items-center gap-2">
                    <Award size={14} /> {t.qualification}
                  </p>
                )}
                {t.specialization && (
                  <p className="text-xs text-gray-400">Specialization: {t.specialization}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}