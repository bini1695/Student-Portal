'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '@/store/authStore';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, login, hydrated, loadFromStorage } = useAuth();

  // Load user from localStorage on mount
  useEffect(() => {
    if (!hydrated) loadFromStorage();
  }, [hydrated, loadFromStorage]);

  // Redirect to /login if not authenticated
  useEffect(() => {
    if (hydrated && !user) {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/login');
        return;
      }
      login(token, JSON.parse(userData));
    }
  }, [hydrated, user, login, router]);

  // Show spinner while loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}