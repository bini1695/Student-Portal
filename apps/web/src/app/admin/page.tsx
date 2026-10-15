'use client';
import { BookOpen, ClipboardList, GraduationCap, Layers, Users } from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export default function AdminDashboard() {
  return (
    <DashboardOverview
      title="Admin Dashboard"
      stats={[
        { key: 'totalStudents', label: 'Students', icon: GraduationCap, color: 'green' },
        { key: 'totalTeachers', label: 'Teachers', icon: Users, color: 'blue' },
        { key: 'totalCourses', label: 'Courses', icon: BookOpen, color: 'yellow' },
        { key: 'totalSections', label: 'Sections', icon: Layers, color: 'purple' },
        { key: 'pendingEnrollments', label: 'Pending Enrollments', icon: ClipboardList, color: 'red' },
      ]}
      shortcuts={[
        { label: 'Manage students', href: '/admin/students' },
        { label: 'Manage teachers', href: '/admin/teachers' },
        { label: 'Manage courses', href: '/admin/courses' },
        { label: 'Review enrollments', href: '/admin/enrollments' },
      ]}
    />
  );
}