'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Users, Clock, Mail, ClipboardList, Award, BookOpen,
} from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function ClassDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [section, setSection] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [secRes, eRes, stuRes] = await Promise.all([
          api.get(`/course-sections/${id}`),
          api.get('/enrollments'),
          api.get('/students'),
        ]);
        setSection(secRes.data);
        setEnrollments(
          (eRes.data || []).filter(
            (e: any) => e.courseSectionId === Number(id),
          ),
        );
        setStudents(stuRes.data || []);

        if (secRes.data?.courseId) {
          const cr = await api.get(`/courses/${secRes.data.courseId}`);
          setCourse(cr.data);
        }
      } catch (err) {
        console.error('Class detail error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const getStudentInfo = (studentId: number) =>
    students.find((s) => s.id === studentId);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={40} />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="space-y-6">
        <a
          href="/teacher/classes"
          className="text-blue-600 hover:underline inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} /> Back to Classes
        </a>
        <div className="card text-center py-12">
          <p className="text-gray-500">Class not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <a
        href="/teacher/classes"
        className="text-blue-600 hover:underline inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={16} /> Back to Classes
      </a>

      {/* Class Info */}
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
            <BookOpen size={24} />
          </div>
          <div className="flex-1">
            <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {course?.code || 'N/A'}
            </span>
            <h1 className="text-2xl font-bold mt-2">
              {course?.title || 'Course'} — Section {section.sectionName}
            </h1>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {section.dayOfWeek} {section.startTime}–
                {section.endTime}
              </span>
              <span>Room: {section.room || 'TBA'}</span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {section.enrolledCount}/{section.capacity}{' '}
                students
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <a
          href="/teacher/attendance"
          className="card hover:shadow-md transition text-center"
        >
          <ClipboardList className="mx-auto text-blue-600 mb-2" size={24} />
          <p className="text-sm font-medium">Mark Attendance</p>
        </a>
        <a
          href="/teacher/grades"
          className="card hover:shadow-md transition text-center"
        >
          <Award className="mx-auto text-green-600 mb-2" size={24} />
          <p className="text-sm font-medium">Enter Grades</p>
        </a>
        <a
          href="/teacher/assignments"
          className="card hover:shadow-md transition text-center"
        >
          <ClipboardList className="mx-auto text-purple-600 mb-2" size={24} />
          <p className="text-sm font-medium">Assignments</p>
        </a>
      </div>

      {/* Enrolled Students */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users size={20} /> Enrolled Students ({enrollments.length})
        </h2>
        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">No students enrolled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs text-gray-500 uppercase border-b">
                <tr>
                  <th className="text-left py-3 px-3">Code</th>
                  <th className="text-left py-3 px-3">Name</th>
                  <th className="text-left py-3 px-3">Email</th>
                  <th className="text-left py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => {
                  const stu = getStudentInfo(e.studentId);
                  return (
                    <tr key={e.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-3 font-mono text-sm">
                        {stu?.studentCode || '—'}
                      </td>
                      <td className="py-3 px-3 font-medium">
                        {stu?.user?.fullName || `Student #${e.studentId}`}
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail size={12} /> {stu?.user?.email || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            e.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}