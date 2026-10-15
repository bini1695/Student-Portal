'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '@/store/authStore';

const ROLE_HOME: Record<string, string> = {
  super_admin: '/super-admin',
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
  accountant: '/accountant',
  dept_head: '/dept-head',
};
const isRole = (value: string): value is keyof typeof ROLE_HOME =>
  Object.prototype.hasOwnProperty.call(ROLE_HOME, value);

export function DashboardShell({
  children,
  expectedRole: expectedRoleProp,
}: {
  children: React.ReactNode;
  expectedRole?: keyof typeof ROLE_HOME;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated, loadFromStorage } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathRole = pathname.split('/').filter(Boolean)[0] || '';
  const expectedRole = expectedRoleProp ?? (isRole(pathRole) ? pathRole : null);

  useEffect(() => {
    if (!hydrated) loadFromStorage();
  }, [hydrated, loadFromStorage]);

  useEffect(() => {
    if (!hydrated) return;
    if (!expectedRole) {
      router.replace('/');
    } else if (!user) {
      router.replace('/login');
    } else if (user.role !== expectedRole) {
      router.replace(ROLE_HOME[user.role] || '/');
    }
  }, [expectedRole, hydrated, router, user]);

  if (!hydrated || !expectedRole || !user || user.role !== expectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileMenuOpen} onNavigate={() => setMobileMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileMenuOpen((open) => !open)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}