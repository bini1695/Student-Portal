'use client';
import { Award, Bell, BookOpen, ClipboardList, DollarSign, GraduationCap } from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export default function StudentDashboard() {
  return (
    <DashboardOverview
      title="Student Dashboard"
      stats={[
        { key: 'totalEnrollments', label: 'Enrollments', icon: BookOpen, color: 'blue' },
        { key: 'outstandingBalance', label: 'Outstanding Balance', icon: DollarSign, color: 'red', currency: true },
        { key: 'recentAnnouncements', label: 'Recent Announcements', icon: Bell, color: 'yellow' },
        { key: 'cumulativeGpa', label: 'Cumulative GPA', icon: Award, color: 'purple' },
        { key: 'completedCredits', label: 'Completed Credits', icon: GraduationCap, color: 'green' },
      ]}
      shortcuts={[
        { label: 'My courses', href: '/student/courses' },
        { label: 'Enroll in a course', href: '/student/enroll' },
        { label: 'View assignments', href: '/student/assignments' },
        { label: 'View grades', href: '/student/grades' },
        { label: 'View fees', href: '/student/fees' },
      ]}
    />
  );
}