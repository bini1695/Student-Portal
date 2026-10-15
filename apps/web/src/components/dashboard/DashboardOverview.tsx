'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { StatCard } from '@/components/charts/StatCard';
import { DashboardStatus } from '@/components/layout/DashboardStatus';
import { DashboardPayload, useDashboardData } from '@/hooks/useDashboardData';

export interface DashboardStat {
  key: string;
  label: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  currency?: boolean;
}

interface DashboardPanelData {
  title: string;
  action: string;
  href: string;
  entries: { title: string; detail: string; status?: string }[];
}

function asRecords(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      typeof item === 'object' && item !== null && !Array.isArray(item),
  );
}

function recordText(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

function getPanels(data: DashboardPayload): DashboardPanelData[] {
  if (data.role === 'admin') {
    return [{
      title: 'Recent enrollment requests',
      action: 'Review all',
      href: '/admin/enrollments',
      entries: asRecords(data.recentEnrollments).slice(0, 5).map((item) => ({
        title: `Enrollment #${recordText(item.id, '—')}`,
        detail: item.enrolledAt ? new Date(String(item.enrolledAt)).toLocaleDateString() : 'Recently submitted',
        status: recordText(item.status, 'pending'),
      })),
    }];
  }

  if (data.role === 'teacher') {
    return [{
      title: 'My teaching sections',
      action: 'Open classes',
      href: '/teacher/classes',
      entries: asRecords(data.sections).slice(0, 5).map((item) => ({
        title: `Section ${recordText(item.sectionName, recordText(item.id, '—'))}`,
        detail: [
          item.room ? `Room ${String(item.room)}` : null,
          `${recordText(item.enrolledCount, '0')} / ${recordText(item.capacity, '—')} students`,
        ].filter(Boolean).join(' · '),
        status: recordText(item.status, ''),
      })),
    }];
  }

  if (data.role === 'student') {
    const enrollments = asRecords(data.enrollments).slice(0, 4);
    const announcements = asRecords(data.recentAnnouncements).slice(0, 4);
    const invoices = asRecords(data.invoices).slice(0, 4);
    const grades = asRecords(data.recentGrades).slice(0, 5);
    return [
      {
        title: 'Recent grades',
        action: 'View grades',
        href: '/student/grades',
        entries: grades.map((item) => ({
          title: [
            item.courseCode ? String(item.courseCode) : null,
            item.courseTitle ? String(item.courseTitle) : null,
            item.sectionName ? `Section ${String(item.sectionName)}` : null,
          ].filter(Boolean).join(' · ') || `Enrollment #${recordText(item.enrollmentId, '—')}`,
          detail: [
            `Total score: ${recordText(item.totalScore, '—')}`,
            item.letterGrade ? `Grade: ${String(item.letterGrade)}` : null,
          ].filter(Boolean).join(' · '),
          status: item.approvalStatus === 'submitted' ? 'Awaiting approval' : 'Approved',
        })),
      },
      {
        title: 'My recent enrollments',
        action: 'View courses',
        href: '/student/courses',
        entries: enrollments.map((item) => ({
          title: `Enrollment #${recordText(item.id, '—')}`,
          detail: item.enrolledAt ? new Date(String(item.enrolledAt)).toLocaleDateString() : 'Course enrollment',
          status: recordText(item.status, 'pending'),
        })),
      },
      {
        title: 'Recent announcements',
        action: 'All announcements',
        href: '/student/announcements',
        entries: announcements.map((item) => ({
          title: recordText(item.title, 'University announcement'),
          detail: item.createdAt ? new Date(String(item.createdAt)).toLocaleDateString() : 'Latest update',
        })),
      },
      {
        title: 'Recent invoices',
        action: 'View fees',
        href: '/student/fees',
        entries: invoices.map((item) => ({
          title: `Invoice #${recordText(item.id, '—')}`,
          detail: `Due ${recordText(item.totalDue, '—')} · Paid ${recordText(item.amountPaid, '0')}`,
          status: recordText(item.status, 'unpaid'),
        })),
      },
    ];
  }

  if (data.role === 'accountant') {
    return [{
      title: 'Recent payments',
      action: 'View all payments',
      href: '/accountant/payments',
      entries: asRecords(data.recentPayments).slice(0, 5).map((item) => ({
        title: `Payment #${recordText(item.id, '—')}`,
        detail: `${recordText(item.amount, '—')} · ${item.paymentDate ? new Date(String(item.paymentDate)).toLocaleDateString() : 'Recently recorded'}`,
        status: recordText(item.method, ''),
      })),
    }];
  }

  return [];
}

export function DashboardOverview({
  title,
  stats,
  shortcuts,
}: {
  title: string;
  stats: DashboardStat[];
  shortcuts: { label: string; href: string }[];
}) {
  const { data, loading, error, reload } = useDashboardData();
  const panels = data ? getPanels(data) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {typeof data?.department === 'object' && data.department !== null && 'name' in data.department && (
            <p className="mt-1 text-gray-500">{String(data.department.name)}</p>
          )}
        </div>
        <button type="button" onClick={() => void reload()} disabled={loading} className="btn btn-secondary">
          {loading ? 'Refreshing…' : 'Refresh data'}
        </button>
      </div>
      <DashboardStatus loading={loading} error={error} onRetry={() => void reload()} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const value = data?.stats?.[stat.key];
          const numericValue = Number(value);
          const displayValue = loading && value === undefined
            ? '…'
            : value === undefined
              ? '—'
              : stat.currency && Number.isFinite(numericValue)
                ? `$${numericValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : value;
          return (
            <StatCard
              key={stat.key}
              title={stat.label}
              value={displayValue}
              icon={stat.icon}
              color={stat.color}
            />
          );
        })}
      </div>

      {panels.length > 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {panels.map((panel) => (
            <section key={panel.title} className="card">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">{panel.title}</h2>
                <Link href={panel.href} className="text-sm font-medium text-blue-600 hover:underline">
                  {panel.action}
                </Link>
              </div>
              {panel.entries.length === 0 ? (
                <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                  Nothing to show yet.
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {panel.entries.map((entry, index) => (
                    <li key={`${entry.title}-${index}`} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-800">{entry.title}</p>
                        <p className="mt-1 text-sm text-gray-500">{entry.detail}</p>
                      </div>
                      {entry.status && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
                          {entry.status}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {data?.role === 'dept_head' && !data.department && !loading && (
        <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Your account is not assigned to a department yet. Ask a super administrator to assign your department.
        </div>
      )}

      <section className="card">
        <h2 className="mb-3 font-semibold">Quick access</h2>
        <div className="flex flex-wrap gap-3">
          {shortcuts.map((shortcut) => (
            <Link key={shortcut.href} href={shortcut.href} className="btn btn-secondary">
              {shortcut.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
