'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, hydrated, loadFromStorage } = useAuth();

  useEffect(() => {
    if (!hydrated) loadFromStorage();
  }, [hydrated, loadFromStorage]);

  useEffect(() => {
    if (hydrated) {
      const token = localStorage.getItem('token');
      if (!token) router.push('/login');
    }
  }, [hydrated, router]);

  return <DashboardShell>{children}</DashboardShell>;
}