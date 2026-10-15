'use client';
import { useAuth } from '@/store/authStore';
import { Menu, UserCircle } from 'lucide-react';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Welcome, {user.fullName}
        </h1>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>
        <UserCircle className="text-blue-600" size={32} />
        <span className="text-sm font-medium capitalize text-gray-700">
          {user.role.replace('_', ' ')}
        </span>
      </div>
    </header>
  );
}