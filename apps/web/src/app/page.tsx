'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const u = JSON.parse(userData);
    const routes: Record<string, string> = {
      super_admin: '/super-admin',
      admin: '/admin',
      teacher: '/teacher',
      student: '/student',
      accountant: '/accountant',
      dept_head: '/dept-head',
    };
    router.push(routes[u.role] || '/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}