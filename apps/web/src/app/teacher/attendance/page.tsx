'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Calendar, Check, X, Clock } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function TeacherAttendancePage() {
  const [sections, setSections] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/course-sections').then((r) => setSections(r.data)),
      api.get('/courses').then((r) => setCourses(r.data)),
      api.get('/students').then((r) => setStudents(r.data)),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSection) {
      setEnrollments([]);
      return;
    }
    api.get('/enrollments').then((r) => {
      setEnrollments(
        (r.data || []).filter(
          (e: any) => e.courseSectionId === Number(selectedSection),
        ),
      );
    });
  }, [selectedSection]);

  const getCourse = (id: number) => courses.find((c) => c.id === id);

  const getStudentName = (studentId: number) => {
    const s = students.find((x) => x.id === studentId);
    return s?.user?.fullName || `Student #${studentId}`;
  };

  const getStudentCode = (studentId: number) => {
    const s = students.find((x) => x.id === studentId);
    return s?.studentCode || '';
  };

  const setStatus = (studentId: number, status: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const all: Record<number, string> = {};
    enrollments.forEach((e) => {
      all[e.studentId] = 'present';
    });
    setAttendance(all);
  };

  const handleSave = async () => {
    if (!selectedSection) {
      toast.error('Please select a section first');
      return;
    }
    if (Object.keys(attendance).length === 0) {
      toast.error('Please mark at least one student');
      return;
    }

    setSaving(true);
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        courseSectionId: Number(selectedSection),
        studentId: Number(studentId),
        attendanceDate: date,
        status,
      }));

      await Promise.all(
        records.map((r) =>
          api.post('/attendance', r).catch((err) => {
            // Ignore duplicate errors
            if (err.response?.status !== 409) throw err;
          }),
        ),
      );

      toast.success(`Attendance saved for ${records.length} students`);
      setAttendance({});
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-gray-500 mt-1">Record student attendance for a class</p>
      </div>

      <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Select Section</label>
          <select
            className="input"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">— Choose a section —</option>
            {sections.map((s) => {
              const c = getCourse(s.courseId);
              return (
                <option key={s.id} value={s.id}>
                  {c?.code || 'Course'} — Section {s.sectionName} ({s.dayOfWeek} {s.startTime})
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {selectedSection && enrollments.length === 0 && (
        <div className="card text-center py-12">
          <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No students enrolled in this section</p>
        </div>
      )}

      {selectedSection && enrollments.length > 0 && (
        <>
          <div className="flex justify-end">
            <button onClick={markAllPresent} className="btn btn-secondary">
              ✓ Mark All Present
            </button>
          </div>

          <div className="card overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">
              Students ({enrollments.length})
            </h2>
            <table className="w-full">
              <thead className="text-xs text-gray-500 uppercase border-b">
                <tr>
                  <th className="text-left py-3 px-3">Code</th>
                  <th className="text-left py-3 px-3">Student</th>
                  <th className="text-center py-3 px-3">Present</th>
                  <th className="text-center py-3 px-3">Late</th>
                  <th className="text-center py-3 px-3">Absent</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono text-sm">
                      {getStudentCode(e.studentId)}
                    </td>
                    <td className="py-3 px-3 font-medium">
                      {getStudentName(e.studentId)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setStatus(e.studentId, 'present')}
                        className={`p-2 rounded-lg transition ${
                          attendance[e.studentId] === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 hover:bg-green-100'
                        }`}
                      >
                        <Check size={16} />
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setStatus(e.studentId, 'late')}
                        className={`p-2 rounded-lg transition ${
                          attendance[e.studentId] === 'late'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 hover:bg-yellow-100'
                        }`}
                      >
                        <Clock size={16} />
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setStatus(e.studentId, 'absent')}
                        className={`p-2 rounded-lg transition ${
                          attendance[e.studentId] === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 hover:bg-red-100'
                        }`}
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving
                ? 'Saving...'
                : `Save Attendance (${Object.keys(attendance).length})`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}