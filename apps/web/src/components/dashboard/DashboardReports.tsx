'use client';

import { BookOpen, DollarSign, GraduationCap, Receipt, Users } from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export function AccountantReports() {
  return (
    <DashboardOverview
      title="Financial Reports"
      stats={[
        { key: 'totalInvoices', label: 'Invoices', icon: Receipt, color: 'blue' },
        { key: 'totalBilled', label: 'Total billed', icon: DollarSign, color: 'yellow', currency: true },
        { key: 'totalCollected', label: 'Collected', icon: DollarSign, color: 'green', currency: true },
        { key: 'outstanding', label: 'Outstanding', icon: DollarSign, color: 'red', currency: true },
      ]}
      shortcuts={[
        { label: 'Manage invoices', href: '/accountant/invoices' },
        { label: 'Manage payments', href: '/accountant/payments' },
        { label: 'Fee structures', href: '/accountant/fee-structures' },
      ]}
    />
  );
}

export function DepartmentReports() {
  return (
    <DashboardOverview
      title="Department Reports"
      stats={[
        { key: 'students', label: 'Students', icon: GraduationCap, color: 'green' },
        { key: 'teachers', label: 'Teachers', icon: Users, color: 'blue' },
        { key: 'courses', label: 'Courses', icon: BookOpen, color: 'purple' },
      ]}
      shortcuts={[
        { label: 'Department students', href: '/dept-head/students' },
        { label: 'Department teachers', href: '/dept-head/teachers' },
        { label: 'Department courses', href: '/dept-head/courses' },
        { label: 'Enrollments', href: '/dept-head/enrollments' },
      ]}
    />
  );
}
