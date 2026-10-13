'use client';
import { useAuth } from '@/store/authStore';
import { UserCircle } from 'lucide-react';

export function Topbar() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Welcome, {user.fullName}
        </h1>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
      <div className="flex items-center gap-2">
        <UserCircle className="text-blue-600" size={32} />
        <span className="text-sm font-medium capitalize text-gray-700">
          {user.role.replace('_', ' ')}
        </span>
      </div>
    </header>
  );
}