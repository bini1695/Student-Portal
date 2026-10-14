'use client';
import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TeacherSchedulePage() {
  const [sections, setSections] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/course-sections').then((r) => setSections(r.data)),
      api.get('/courses').then((r) => setCourses(r.data)),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getCourse = (id: number) => courses.find((c) => c.id === id);

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  const totalClasses = sections.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <p className="text-gray-500 mt-1">
          Weekly class schedule — {totalClasses} classes
        </p>
      </div>

      {totalClasses === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No classes scheduled</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DAYS.map((day) => {
            const daySections = sections
              .filter((s) => s.dayOfWeek === day)
              .sort((a, b) =>
                (a.startTime || '').localeCompare(b.startTime || ''),
              );

            return (
              <div key={day} className="card">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Calendar size={18} /> {day}
                </h3>
                {daySections.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    No classes
                  </p>
                ) : (
                  <div className="space-y-3">
                    {daySections.map((s) => {
                      const c = getCourse(s.courseId);
                      return (
                        <div
                          key={s.id}
                          className="border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded"
                        >
                          <p className="text-xs font-mono text-blue-700">
                            {c?.code || 'N/A'}
                          </p>
                          <p className="font-medium text-sm mt-0.5">
                            {c?.title || 'Course'}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Section {s.sectionName}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock size={12} /> {s.startTime}–{s.endTime}
                          </p>
                          {s.room && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin size={12} /> {s.room}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}