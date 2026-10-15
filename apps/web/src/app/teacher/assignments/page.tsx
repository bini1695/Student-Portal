'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, ClipboardList, Calendar, Users, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

interface Assignment {
  id: number;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  status: 'draft' | 'open' | 'closed';
}

interface ApiAssignment {
  id: number;
  title: string;
  courseSectionId: number;
  dueDate?: string;
  description?: string;
}

interface ApiCourseSection {
  id: number;
  courseId: number;
  sectionName?: string;
  enrolledCount?: number;
  capacity?: number;
  status?: string;
}

interface ApiCourse {
  id: number;
  code?: string;
  title?: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const [assignmentsRes, sectionsRes, coursesRes] = await Promise.all([
          api.get('/assignments'),
          api.get('/course-sections'),
          api.get('/courses'),
        ]);

        const sections = Array.isArray(sectionsRes.data) ? (sectionsRes.data as ApiCourseSection[]) : [];
        const courses = Array.isArray(coursesRes.data) ? (coursesRes.data as ApiCourse[]) : [];
        const mappedAssignments: Assignment[] = (Array.isArray(assignmentsRes.data) ? assignmentsRes.data : []).map((item: ApiAssignment) => {
          const section = sections.find((entry) => entry.id === item.courseSectionId);
          const course = courses.find((entry) => entry.id === section?.courseId);
          const totalStudents = Math.max(Number(section?.capacity ?? 0), Number(section?.enrolledCount ?? 0));
          const status: Assignment['status'] = section?.status === 'closed' ? 'closed' : 'open';

          return {
            id: item.id,
            title: item.title,
            courseCode: course?.code ?? `SEC-${section?.sectionName ?? 'N/A'}`,
            courseName: course?.title ?? `Section ${section?.sectionName ?? item.courseSectionId}`,
            dueDate: item.dueDate ?? new Date().toISOString(),
            submissions: Number(section?.enrolledCount ?? 0),
            totalStudents,
            status,
          };
        });

        setAssignments(mappedAssignments);
      } catch {
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    void loadAssignments();
  }, []);

  const statusStyles: Record<string, string> = {
    draft:  'bg-gray-100 text-gray-600',
    open:   'bg-emerald-50 text-emerald-700',
    closed: 'bg-red-50 text-red-700',
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create, track, and grade student assignments.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <Plus size={18} />
          New Assignment
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <ClipboardList className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500">No assignments yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a, i) => {
            const progress = a.totalStudents
              ? Math.round((a.submissions / a.totalStudents) * 100)
              : 0;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/teacher/assignments/${a.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition p-5"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <ClipboardList className="text-blue-600" size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-gray-900">{a.title}</h3>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[a.status]}`}>
                            {a.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {a.courseCode} · {a.courseName}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> Due {new Date(a.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {a.submissions}/{a.totalStudents} submitted
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="hidden sm:block w-32">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold text-gray-700">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <ArrowRight className="text-gray-400" size={18} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* New assignment modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">New Assignment</h2>
            <div className="space-y-4">
              <input
                placeholder="Assignment title"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition"
              />
              <textarea
                placeholder="Description / instructions"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition resize-none"
              />
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}