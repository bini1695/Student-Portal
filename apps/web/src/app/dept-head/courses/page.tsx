'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { SearchInput } from '@/components/ui/SearchInput';

export default function DeptHeadCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/courses')
      .then((r) => setCourses(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(
    (c) =>
      !search ||
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Department Courses</h1>
        <p className="text-gray-500 mt-1">{courses.length} courses</p>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search courses..." />

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="card hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {c.code}
                </span>
                <span className="text-xs text-gray-500">{c.creditHours} cr</span>
              </div>
              <h3 className="font-semibold mt-3">{c.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {c.description || 'No description'}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                <span>Level {c.level}</span>
                <span className={`px-2 py-0.5 rounded ${
                  c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                }`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}