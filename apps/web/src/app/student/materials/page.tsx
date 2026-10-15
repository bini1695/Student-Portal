'use client';
import { useEffect, useState } from 'react';
import { FileText, Download, BookOpen, Link as LinkIcon } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/course-materials').catch(() => ({ data: [] })),
      api.get('/course-sections').catch(() => ({ data: [] })),
      api.get('/courses').catch(() => ({ data: [] })),
    ])
      .then(([mRes, sRes, cRes]) => {
        setMaterials(mRes.data || []);
        setSections(sRes.data || []);
        setCourses(cRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const getSectionInfo = (id: number) => {
    const s = sections.find((x) => x.id === id);
    if (!s) return `Section #${id}`;
    const c = courses.find((x) => x.id === s.courseId);
    return `${c?.code || 'Course'} — Section ${s.sectionName}`;
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Course Materials</h1>
        <p className="text-gray-500 mt-1">
          {materials.length} materials available
        </p>
      </div>

      {materials.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No materials available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <div key={m.id} className="card hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {getSectionInfo(m.courseSectionId)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                {m.description || 'No description'}
              </p>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {m.fileType || 'file'}
                </span>

                {m.filePath && (
                  <a
                    href={m.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                  >
                    <Download size={14} /> Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}