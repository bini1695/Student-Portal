'use client';
import { BookOpen, GraduationCap, Layers, Users } from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export default function DeptHeadDashboard() {
  return (
    <DashboardOverview
      title="Department Head Dashboard"
      stats={[
        { key: 'teachers', label: 'Teachers', icon: Users, color: 'blue' },
        { key: 'students', label: 'Students', icon: GraduationCap, color: 'green' },
        { key: 'courses', label: 'Courses', icon: BookOpen, color: 'yellow' },
        { key: 'sections', label: 'Course sections', icon: Layers, color: 'purple' },
      ]}
      shortcuts={[
        { label: 'Manage courses', href: '/dept-head/courses' },
        { label: 'View teachers', href: '/dept-head/teachers' },
        { label: 'View students', href: '/dept-head/students' },
        { label: 'Reports', href: '/dept-head/reports' },
      ]}
    />
  );
}