'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

interface Assignment {
  id: number;
  courseSectionId: number;
  title: string;
  description: string | null;
  dueDate: string;
  maxScore: number | string;
}

interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  submissionText: string | null;
  filePath: string | null;
  submittedAt: string;
  status: 'submitted' | 'graded';
  score: number | string | null;
  feedback: string | null;
}

function requestMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error)
    ? error.response?.data?.message ?? error.message
    : fallback;
}

export function StudentAssignmentWorkspace() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Record<number, Submission | null>>({});
  const [work, setWork] = useState<Record<number, { text: string; link: string }>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Assignment[]>('/assignments');
      const results = await Promise.all(
        response.data.map(async (assignment) => {
          const submissionResponse = await api.get<Submission | null>(
            `/assignments/${assignment.id}/submissions/me`,
          );
          return [assignment.id, submissionResponse.data] as const;
        }),
      );
      setAssignments(response.data);
      setSubmissions(Object.fromEntries(results));
    } catch (loadError: unknown) {
      setError(requestMessage(loadError, 'Unable to load assignments.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>, assignmentId: number) {
    event.preventDefault();
    const values = work[assignmentId] ?? { text: '', link: '' };
    if (!values.text.trim() && !values.link.trim()) {
      setError('Add written work or a file link before submitting.');
      return;
    }
    setSavingId(assignmentId);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post<Submission>(
        `/assignments/${assignmentId}/submissions`,
        {
          submissionText: values.text.trim() || null,
          filePath: values.link.trim() || null,
        },
      );
      setSubmissions((current) => ({ ...current, [assignmentId]: response.data }));
      setWork((current) => ({ ...current, [assignmentId]: { text: '', link: '' } }));
      setSuccess(assignmentId);
    } catch (submitError: unknown) {
      setError(requestMessage(submitError, 'Unable to submit this assignment.'));
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="mt-1 text-sm text-gray-500">Review deadlines and submit your work.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => void load()} disabled={loading}>
          Refresh
        </button>
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : assignments.length === 0 ? (
        <div className="card text-sm text-gray-500">No assignments are available.</div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const submission = submissions[assignment.id];
            const values = work[assignment.id] ?? { text: '', link: '' };
            return (
              <article key={assignment.id} className="card space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{assignment.title}</h2>
                    {assignment.description && <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{assignment.description}</p>}
                    <p className="mt-2 text-sm text-gray-500">
                      Due {new Date(assignment.dueDate).toLocaleString()} · {assignment.maxScore} points
                    </p>
                  </div>
                  {submission && (
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {submission.status === 'graded' ? `Graded · ${submission.score}/${assignment.maxScore}` : 'Submitted'}
                    </span>
                  )}
                </div>

                {submission?.feedback && (
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">
                    <strong>Teacher feedback:</strong> {submission.feedback}
                  </p>
                )}
                {submission && (
                  <p className="text-xs text-gray-500">
                    Last submitted {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                )}

                <form onSubmit={(event) => void submit(event, assignment.id)} className="space-y-3 border-t pt-4">
                  <label className="block text-sm font-medium">
                    Written work
                    <textarea
                      className="input mt-1 min-h-24 w-full"
                      value={values.text}
                      onChange={(event) => setWork((current) => ({
                        ...current,
                        [assignment.id]: { ...values, text: event.target.value },
                      }))}
                      placeholder="Enter your response"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    File link
                    <input
                      className="input mt-1 w-full"
                      type="url"
                      value={values.link}
                      onChange={(event) => setWork((current) => ({
                        ...current,
                        [assignment.id]: { ...values, link: event.target.value },
                      }))}
                      placeholder="https://..."
                    />
                  </label>
                  <button type="submit" className="btn btn-primary" disabled={savingId === assignment.id}>
                    {savingId === assignment.id ? 'Submitting…' : submission ? 'Update submission' : 'Submit assignment'}
                  </button>
                  {success === assignment.id && <span role="status" className="ml-3 text-sm text-green-700">Submission saved.</span>}
                </form>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function TeacherAssignmentReview() {
  const params = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [grades, setGrades] = useState<Record<number, { score: string; feedback: string }>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [assignmentResponse, submissionsResponse] = await Promise.all([
        api.get<Assignment>(`/assignments/${params.id}`),
        api.get<Submission[]>(`/assignments/${params.id}/submissions`),
      ]);
      setAssignment(assignmentResponse.data);
      setSubmissions(submissionsResponse.data);
      setGrades(Object.fromEntries(submissionsResponse.data.map((submission) => [
        submission.id,
        {
          score: submission.score === null ? '' : String(submission.score),
          feedback: submission.feedback ?? '',
        },
      ])));
    } catch (loadError: unknown) {
      setError(requestMessage(loadError, 'Unable to load assignment submissions.'));
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function grade(event: FormEvent<HTMLFormElement>, submissionId: number) {
    event.preventDefault();
    const values = grades[submissionId] ?? { score: '', feedback: '' };
    const score = Number(values.score);
    if (values.score.trim() === '' || !Number.isFinite(score) || score < 0 || score > Number(assignment?.maxScore)) {
      setError(`Enter a score from 0 to ${assignment?.maxScore ?? 'the maximum score'}.`);
      return;
    }
    setSavingId(submissionId);
    setError(null);
    setSuccess(null);
    try {
      await api.patch(`/assignments/${params.id}/submissions/${submissionId}`, {
        score,
        feedback: values.feedback,
      });
      setSuccess(submissionId);
      await load();
    } catch (gradeError: unknown) {
      setError(requestMessage(gradeError, 'Unable to save the grade.'));
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Assignment submissions</h1>
        <Link href="/teacher/assignments" className="btn btn-secondary">Back to assignments</Link>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : assignment ? (
        <>
          <div className="card">
            <h2 className="text-lg font-semibold">{assignment.title}</h2>
            <p className="mt-1 text-sm text-gray-500">Due {new Date(assignment.dueDate).toLocaleString()} · {assignment.maxScore} points</p>
            {assignment.description && <p className="mt-3 whitespace-pre-wrap text-sm">{assignment.description}</p>}
          </div>
          {submissions.length === 0 ? (
            <div className="card text-sm text-gray-500">No submissions have been received yet.</div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const values = grades[submission.id] ?? { score: '', feedback: '' };
                return (
                  <article key={submission.id} className="card space-y-3">
                    <div className="flex flex-wrap justify-between gap-2">
                      <h3 className="font-semibold">Student #{submission.studentId}</h3>
                      <span className="text-sm text-gray-500">{new Date(submission.submittedAt).toLocaleString()}</span>
                    </div>
                    {submission.submissionText && <p className="whitespace-pre-wrap text-sm">{submission.submissionText}</p>}
                    {submission.filePath && <a className="text-sm text-blue-700 underline" href={submission.filePath} target="_blank" rel="noreferrer">Open submitted file</a>}
                    <form onSubmit={(event) => void grade(event, submission.id)} className="grid gap-3 border-t pt-3 sm:grid-cols-[10rem_1fr_auto] sm:items-end">
                      <label className="text-sm font-medium">
                        Score (max {assignment.maxScore})
                        <input
                          className="input mt-1 w-full"
                          type="number"
                          min="0"
                          max={Number(assignment.maxScore)}
                          step="0.01"
                          value={values.score}
                          onChange={(event) => setGrades((current) => ({
                            ...current,
                            [submission.id]: { ...values, score: event.target.value },
                          }))}
                          required
                        />
                      </label>
                      <label className="text-sm font-medium">
                        Feedback
                        <textarea
                          className="input mt-1 min-h-10 w-full"
                          value={values.feedback}
                          onChange={(event) => setGrades((current) => ({
                            ...current,
                            [submission.id]: { ...values, feedback: event.target.value },
                          }))}
                        />
                      </label>
                      <button type="submit" className="btn btn-primary" disabled={savingId === submission.id}>
                        {savingId === submission.id ? 'Saving…' : 'Save grade'}
                      </button>
                      {success === submission.id && <span role="status" className="text-sm text-green-700">Grade saved.</span>}
                    </form>
                  </article>
                );
              })}
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
