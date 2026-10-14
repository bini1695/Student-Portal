'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Award, Save, Edit, X } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { SearchInput } from '@/components/ui/SearchInput';

export default function TeacherGradesPage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [gRes, eRes, sRes, secRes, cRes] = await Promise.all([
        api.get('/grades'),
        api.get('/enrollments'),
        api.get('/students'),
        api.get('/course-sections'),
        api.get('/courses'),
      ]);
      setGrades(gRes.data || []);
      setEnrollments(eRes.data || []);
      setStudents(sRes.data || []);
      setSections(secRes.data || []);
      setCourses(cRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getStudentName = (enrollmentId: number) => {
    const e = enrollments.find((x) => x.id === enrollmentId);
    if (!e) return `Enrollment #${enrollmentId}`;
    const s = students.find((x) => x.id === e.studentId);
    return s?.user?.fullName || `Student #${e.studentId}`;
  };

  const getCourseInfo = (enrollmentId: number) => {
    const e = enrollments.find((x) => x.id === enrollmentId);
    if (!e) return '';
    const sec = sections.find((x) => x.id === e.courseSectionId);
    if (!sec) return `Section #${e.courseSectionId}`;
    const c = courses.find((x) => x.id === sec.courseId);
    return `${c?.code || 'N/A'} — Section ${sec.sectionName}`;
  };

  const startEdit = (g: any) => {
    setEditId(g.id);
    setEditForm({
      midtermScore: Number(g.midtermScore) || 0,
      finalScore: Number(g.finalScore) || 0,
      assignmentScore: Number(g.assignmentScore) || 0,
      letterGrade: g.letterGrade || '',
      gradePoint: Number(g.gradePoint) || 0,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const autoGrade = (total: number) => {
    if (total >= 90) return { letterGrade: 'A', gradePoint: 4.0 };
    if (total >= 85) return { letterGrade: 'A-', gradePoint: 3.75 };
    if (total >= 80) return { letterGrade: 'B+', gradePoint: 3.5 };
    if (total >= 75) return { letterGrade: 'B', gradePoint: 3.0 };
    if (total >= 70) return { letterGrade: 'B-', gradePoint: 2.75 };
    if (total >= 65) return { letterGrade: 'C+', gradePoint: 2.5 };
    if (total >= 60) return { letterGrade: 'C', gradePoint: 2.0 };
    if (total >= 50) return { letterGrade: 'D', gradePoint: 1.0 };
    return { letterGrade: 'F', gradePoint: 0 };
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    try {
      const total =
        Number(editForm.midtermScore || 0) +
        Number(editForm.finalScore || 0) +
        Number(editForm.assignmentScore || 0);

      const auto = autoGrade(total);

      await api.patch(`/grades/${id}`, {
        midtermScore: Number(editForm.midtermScore || 0),
        finalScore: Number(editForm.finalScore || 0),
        assignmentScore: Number(editForm.assignmentScore || 0),
        totalScore: total,
        letterGrade: editForm.letterGrade || auto.letterGrade,
        gradePoint:
          Number(editForm.gradePoint) || auto.gradePoint,
      });
      toast.success('Grade saved');
      setEditId(null);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const filtered = grades.filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      getStudentName(g.enrollmentId).toLowerCase().includes(q) ||
      getCourseInfo(g.enrollmentId).toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grades</h1>
        <p className="text-gray-500 mt-1">Enter and manage student grades</p>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by student or course..."
      />

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Award className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No grades recorded yet</p>
          <p className="text-xs text-gray-400 mt-2">
            Add grades via Swagger or create enrollments first.
          </p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="text-left py-3 px-3">Student</th>
                <th className="text-left py-3 px-3">Course</th>
                <th className="text-left py-3 px-3">Midterm</th>
                <th className="text-left py-3 px-3">Final</th>
                <th className="text-left py-3 px-3">Assignment</th>
                <th className="text-left py-3 px-3">Total</th>
                <th className="text-left py-3 px-3">Grade</th>
                <th className="text-left py-3 px-3">GPA</th>
                <th className="text-right py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => {
                const isEditing = editId === g.id;
                const liveTotal = isEditing
                  ? Number(editForm.midtermScore || 0) +
                    Number(editForm.finalScore || 0) +
                    Number(editForm.assignmentScore || 0)
                  : Number(g.totalScore) || 0;

                return (
                  <tr key={g.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium">
                      {getStudentName(g.enrollmentId)}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {getCourseInfo(g.enrollmentId)}
                    </td>
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <input
                          type="number"
                          className="input py-1 px-2 w-20 text-sm"
                          value={editForm.midtermScore}
                          onChange={(e) =>
                            setEditForm({ ...editForm, midtermScore: e.target.value })
                          }
                        />
                      ) : (
                        Number(g.midtermScore) || 0
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <input
                          type="number"
                          className="input py-1 px-2 w-20 text-sm"
                          value={editForm.finalScore}
                          onChange={(e) =>
                            setEditForm({ ...editForm, finalScore: e.target.value })
                          }
                        />
                      ) : (
                        Number(g.finalScore) || 0
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <input
                          type="number"
                          className="input py-1 px-2 w-20 text-sm"
                          value={editForm.assignmentScore}
                          onChange={(e) =>
                            setEditForm({ ...editForm, assignmentScore: e.target.value })
                          }
                        />
                      ) : (
                        Number(g.assignmentScore) || 0
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold">{liveTotal}</td>
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <input
                          className="input py-1 px-2 w-16 text-sm"
                          value={editForm.letterGrade}
                          onChange={(e) =>
                            setEditForm({ ...editForm, letterGrade: e.target.value.toUpperCase() })
                          }
                          maxLength={2}
                        />
                      ) : (
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            g.letterGrade === 'A' || g.letterGrade === 'A-'
                              ? 'bg-green-100 text-green-700'
                              : g.letterGrade?.startsWith('B')
                              ? 'bg-blue-100 text-blue-700'
                              : g.letterGrade?.startsWith('C')
                              ? 'bg-yellow-100 text-yellow-700'
                              : g.letterGrade === 'D'
                              ? 'bg-orange-100 text-orange-700'
                              : g.letterGrade === 'F'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {g.letterGrade || '—'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          className="input py-1 px-2 w-20 text-sm"
                          value={editForm.gradePoint}
                          onChange={(e) =>
                            setEditForm({ ...editForm, gradePoint: e.target.value })
                          }
                        />
                      ) : (
                        Number(g.gradePoint)?.toFixed(2) || '0.00'
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleSave(g.id)}
                            disabled={saving}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(g)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}