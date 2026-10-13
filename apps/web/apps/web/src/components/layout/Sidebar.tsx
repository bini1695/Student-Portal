'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, DollarSign,
  Calendar, ClipboardList, Bell, LogOut, Building2, UserCog,
  Layers, FileText, Award, Home, Upload,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';

type MenuItem = { label: string; href: string; icon: any };

const menus: Record<string, MenuItem[]> = {
  super_admin: [
    { label: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
    { label: 'Users', href: '/super-admin/users', icon: Users },
    { label: 'Roles', href: '/super-admin/roles', icon: UserCog },
    { label: 'Departments', href: '/super-admin/departments', icon: Building2 },
    { label: 'Logs', href: '/super-admin/logs', icon: FileText },
    { label: 'Settings', href: '/super-admin/settings', icon: UserCog },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Students', href: '/admin/students', icon: GraduationCap },
    { label: 'Teachers', href: '/admin/teachers', icon: Users },
    { label: 'Courses', href: '/admin/courses', icon: BookOpen },
    { label: 'Sections', href: '/admin/sections', icon: Layers },
    { label: 'Enrollments', href: '/admin/enrollments', icon: ClipboardList },
    { label: 'Reports', href: '/admin/reports', icon: FileText },
  ],
  teacher: [
    { label: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
    { label: 'My Classes', href: '/teacher/classes', icon: BookOpen },
    { label: 'Attendance', href: '/teacher/attendance', icon: Calendar },
    { label: 'Grades', href: '/teacher/grades', icon: Award },
    { label: 'Materials', href: '/teacher/materials', icon: Upload },
  ],
  student: [
    { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { label: 'Enroll', href: '/student/enroll', icon: BookOpen },
    { label: 'My Courses', href: '/student/courses', icon: GraduationCap },
    { label: 'Schedule', href: '/student/schedule', icon: Calendar },
    { label: 'Grades', href: '/student/grades', icon: Award },
    { label: 'Fees', href: '/student/fees', icon: DollarSign },
    { label: 'Profile', href: '/student/profile', icon: Users },
  ],
  accountant: [
    { label: 'Dashboard', href: '/accountant', icon: LayoutDashboard },
    { label: 'Fees', href: '/accountant/fees', icon: DollarSign },
    { label: 'Invoices', href: '/accountant/invoices', icon: ClipboardList },
    { label: 'Payments', href: '/accountant/payments', icon: DollarSign },
    { label: 'Reports', href: '/accountant/reports', icon: FileText },
  ],
  dept_head: [
    { label: 'Dashboard', href: '/dept-head', icon: LayoutDashboard },
    { label: 'Courses', href: '/dept-head/courses', icon: BookOpen },
    { label: 'Teachers', href: '/dept-head/teachers', icon: Users },
    { label: 'Reports', href: '/dept-head/reports', icon: FileText },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;
  const items = menus[user.role] || [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col sticky top-0 h-screen">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-blue-600">Student Portal</h2>
        <p className="text-xs text-gray-400 capitalize mt-1">
          {user.role.replace('_', ' ')}
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx('sidebar-link', active && 'active')}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="sidebar-link w-full text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}