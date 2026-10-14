'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, ClipboardList, User, Award, Calendar } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function AssignmentSubmissionsPage() {
  const params = useParams();
  const id = params.id as string;

  const [assignment, setAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/assignments/${id}`).then((r) => setAssignment(r.data)).catch(() => null),
      api.get('/assignment-submissions').then((r) => setSubmissions(r.data)).catch(() => []),
      api.get('/students').then((r) => setStudents(r.data)).catch(() => []),
    ]).finally(() => setLoading(false));
  }, [id]);

  const getStudentName = (studentId: number) => {
    const s = students.find((x) => x.id === studentId);
    return s?.user?.fullName || `Student #${studentId}`;
  };

  const assignmentSubs = submissions.filter(
    (s) => s.assignmentId === Number(id),
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  if (!assignment) {
    return (
      <div className="space-y-6">
        <a
          href="/teacher/assignments"
          className="text-blue-600 hover:underline inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} /> Back to Assignments
        </a>
        <div className="card text-center py-12">
          <p className="text-gray-500">Assignment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <a
        href="/teacher/assignments"
        className="text-blue-600 hover:underline inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={16} /> Back to Assignments
      </a>

      <div className="card">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
            <ClipboardList size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{assignment.title}</h1>
            <p className="text-gray-500 mt-1">
              {assignment.description || 'No description'}
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Award size={14} /> Max: {assignment.maxScore}
              </span>
              {assignment.dueDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Due:{' '}
                  {new Date(assignment.dueDate).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award size={20} /> Submissions ({assignmentSubs.length})
        </h2>
        {assignmentSubs.length === 0 ? (
          <div className="text-center py-12">
            <Award className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">No submissions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs text-gray-500 uppercase border-b">
                <tr>
                  <th className="text-left py-3 px-3">Student</th>
                  <th className="text-left py-3 px-3">Submitted</th>
                  <th className="text-left py-3 px-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {assignmentSubs.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium">
                      <span className="flex items-center gap-2">
                        <User size={14} /> {getStudentName(sub.studentId)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {sub.submittedAt
                        ? new Date(sub.submittedAt).toLocaleString()
                        : '—'}
                    </td>
                    <td className="py-3 px-3">
                      {sub.score != null ? (
                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                          {sub.score} / {assignment.maxScore}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Not graded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}