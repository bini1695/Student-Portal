'use client';
import { useEffect, useState } from 'react';
import { Bell, Calendar } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/announcements')
      .then((r) => setAnnouncements(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-gray-500 mt-1">{announcements.length} announcements</p>
      </div>

      {announcements.length === 0 ? (
        <div className="card text-center py-12">
          <Bell className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{a.title}</h3>
                  <p className="text-gray-600 mt-1">{a.content}</p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}