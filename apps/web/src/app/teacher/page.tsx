'use client';

import {
  BookOpen,
  ClipboardList,
  TrendingUp,
  Users,
} from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export default function TeacherDashboard() {
  return (
    <DashboardOverview
      title="Teacher Dashboard"
      stats={[
        { key: 'totalSections', label: 'My Sections', icon: BookOpen, color: 'blue' },
        { key: 'totalStudents', label: 'Students', icon: Users, color: 'green' },
        { key: 'totalAssignments', label: 'Assignments', icon: ClipboardList, color: 'yellow' },
        { key: 'attendanceRate', label: 'Avg Attendance', icon: TrendingUp, color: 'purple' },
      ]}
      shortcuts={[
        { label: 'My classes', href: '/teacher/classes' },
        { label: 'Attendance', href: '/teacher/attendance' },
        { label: 'Grades', href: '/teacher/grades' },
        { label: 'Assignments', href: '/teacher/assignments' },
        { label: 'Schedule', href: '/teacher/schedule' },
      ]}
    />
  );
}
