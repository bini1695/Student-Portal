'use client';

import { Fragment, FormEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface Semester {
  id: number;
  academicYearId: number;
  name: string;
  startDate: string;
  endDate: string;
  enrollmentOpen: boolean;
  isCurrent: boolean;
}

const emptyYear = { name: '', startDate: '', endDate: '', isCurrent: false };
const emptySemester = {
  academicYearId: '',
  name: '',
  startDate: '',
  endDate: '',
  enrollmentOpen: false,
  isCurrent: false,
};

export default function SuperAdminSettingsPage() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [yearForm, setYearForm] = useState(emptyYear);
  const [semesterForm, setSemesterForm] = useState(emptySemester);
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editingSemester, setEditingSemester] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [yearResponse, semesterResponse] = await Promise.all([
        api.get<AcademicYear[]>('/academic-years'),
        api.get<Semester[]>('/semesters'),
      ]);
      setYears(yearResponse.data);
      setSemesters(semesterResponse.data);
    } catch {
      toast.error('Could not load academic year and term settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveYear = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingYear) await api.patch(`/academic-years/${editingYear}`, yearForm);
      else await api.post('/academic-years', yearForm);
      toast.success('Academic year saved.');
      setEditingYear(null);
      setYearForm(emptyYear);
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not save academic year.');
    } finally {
      setSaving(false);
    }
  };

  const saveSemester = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...semesterForm, academicYearId: Number(semesterForm.academicYearId) };
      if (editingSemester) await api.patch(`/semesters/${editingSemester}`, payload);
      else await api.post('/semesters', payload);
      toast.success('Term settings saved.');
      setEditingSemester(null);
      setSemesterForm(emptySemester);
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not save term.');
    } finally {
      setSaving(false);
    }
  };

  const editYear = (year: AcademicYear) => {
    setEditingYear(year.id);
    setYearForm({
      name: year.name,
      startDate: year.startDate.slice(0, 10),
      endDate: year.endDate.slice(0, 10),
      isCurrent: year.isCurrent,
    });
  };

  const editSemester = (semester: Semester) => {
    setEditingSemester(semester.id);
    setSemesterForm({
      academicYearId: String(semester.academicYearId),
      name: semester.name,
      startDate: semester.startDate.slice(0, 10),
      endDate: semester.endDate.slice(0, 10),
      enrollmentOpen: semester.enrollmentOpen,
      isCurrent: semester.isCurrent,
    });
  };

  const yearName = (yearId: number) => years.find(({ id }) => id === yearId)?.name ?? `Year #${yearId}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Global Academic Settings</h1>
        <p className="mt-1 text-gray-500">Configure the academic year, term dates, and registration windows.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={40} /></div>
      ) : (
        <>
          <section className="grid gap-6 xl:grid-cols-2">
            <form onSubmit={saveYear} className="card space-y-4">
              <h2 className="font-semibold">{editingYear ? 'Edit academic year' : 'Add academic year'}</h2>
              <label>
                <span className="label">Academic year name</span>
                <input className="input" required value={yearForm.name} onChange={(event) => setYearForm({ ...yearForm, name: event.target.value })} placeholder="2026/2027" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="label">Start date</span>
                  <input className="input" type="date" required value={yearForm.startDate} onChange={(event) => setYearForm({ ...yearForm, startDate: event.target.value })} />
                </label>
                <label>
                  <span className="label">End date</span>
                  <input className="input" type="date" required value={yearForm.endDate} onChange={(event) => setYearForm({ ...yearForm, endDate: event.target.value })} />
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={yearForm.isCurrent} onChange={(event) => setYearForm({ ...yearForm, isCurrent: event.target.checked })} />
                Set as current academic year
              </label>
              <div className="flex gap-3">
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : editingYear ? 'Save changes' : 'Add year'}</button>
                {editingYear && <button type="button" className="btn btn-secondary" onClick={() => { setEditingYear(null); setYearForm(emptyYear); }}>Cancel</button>}
              </div>
            </form>

            <form onSubmit={saveSemester} className="card space-y-4">
              <h2 className="font-semibold">{editingSemester ? 'Edit term' : 'Add term'}</h2>
              <label>
                <span className="label">Academic year</span>
                <select className="input" required value={semesterForm.academicYearId} onChange={(event) => setSemesterForm({ ...semesterForm, academicYearId: event.target.value })}>
                  <option value="">Select academic year</option>
                  {years.map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}
                </select>
              </label>
              <label>
                <span className="label">Term name</span>
                <input className="input" required value={semesterForm.name} onChange={(event) => setSemesterForm({ ...semesterForm, name: event.target.value })} placeholder="Fall semester" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="label">Start date</span>
                  <input className="input" type="date" required value={semesterForm.startDate} onChange={(event) => setSemesterForm({ ...semesterForm, startDate: event.target.value })} />
                </label>
                <label>
                  <span className="label">End date</span>
                  <input className="input" type="date" required value={semesterForm.endDate} onChange={(event) => setSemesterForm({ ...semesterForm, endDate: event.target.value })} />
                </label>
              </div>
              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={semesterForm.enrollmentOpen} onChange={(event) => setSemesterForm({ ...semesterForm, enrollmentOpen: event.target.checked })} />
                  Enrollment open
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={semesterForm.isCurrent} onChange={(event) => setSemesterForm({ ...semesterForm, isCurrent: event.target.checked })} />
                  Current term
                </label>
              </div>
              <div className="flex gap-3">
                <button className="btn btn-primary" type="submit" disabled={saving || years.length === 0}>{saving ? 'Saving…' : editingSemester ? 'Save changes' : 'Add term'}</button>
                {editingSemester && <button type="button" className="btn btn-secondary" onClick={() => { setEditingSemester(null); setSemesterForm(emptySemester); }}>Cancel</button>}
              </div>
            </form>
          </section>

          <section className="card overflow-x-auto">
            <h2 className="mb-3 font-semibold">Academic years and terms</h2>
            {years.length === 0 ? <p className="py-5 text-center text-gray-500">Add an academic year to begin configuring terms.</p> : (
              <table className="w-full text-left text-sm">
                <thead className="border-b text-xs uppercase text-gray-500">
                  <tr><th className="py-3">Year / term</th><th className="py-3">Dates</th><th className="py-3">Registration</th><th className="py-3">Current</th><th className="py-3 text-right">Action</th></tr>
                </thead>
                <tbody>
                  {years.map((year) => (
                    <Fragment key={year.id}>
                      <tr className="border-b bg-gray-50">
                        <td className="py-3 font-semibold">{year.name}</td>
                        <td className="py-3">{new Date(year.startDate).toLocaleDateString()} – {new Date(year.endDate).toLocaleDateString()}</td>
                        <td className="py-3">—</td>
                        <td className="py-3">{year.isCurrent ? 'Current year' : '—'}</td>
                        <td className="py-3 text-right"><button type="button" className="text-blue-600 hover:underline" onClick={() => editYear(year)}>Edit</button></td>
                      </tr>
                      {semesters.filter((semester) => semester.academicYearId === year.id).map((semester) => (
                        <tr key={semester.id} className="border-b">
                          <td className="py-3 pl-6">{semester.name} <span className="text-xs text-gray-500">({yearName(semester.academicYearId)})</span></td>
                          <td className="py-3">{new Date(semester.startDate).toLocaleDateString()} – {new Date(semester.endDate).toLocaleDateString()}</td>
                          <td className="py-3">{semester.enrollmentOpen ? 'Open' : 'Closed'}</td>
                          <td className="py-3">{semester.isCurrent ? 'Current term' : '—'}</td>
                          <td className="py-3 text-right"><button type="button" className="text-blue-600 hover:underline" onClick={() => editSemester(semester)}>Edit</button></td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}
