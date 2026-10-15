'use client';
import { create } from 'zustand';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  roleId?: number;
  phone?: string | null;
}

const isUser = (value: unknown): value is User => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.email === 'string' &&
    typeof candidate.fullName === 'string' &&
    typeof candidate.role === 'string' &&
    (candidate.roleId === undefined || typeof candidate.roleId === 'number') &&
    (candidate.phone === undefined || candidate.phone === null || typeof candidate.phone === 'string')
  );
};

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,
  login: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `user_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
    }
    set({ token, user, hydrated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'access_token=; path=/; max-age=0';
      document.cookie = 'user_role=; path=/; max-age=0';
    }
    set({ token: null, user: null, hydrated: true });
  },
  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      set({ token: null, user: null, hydrated: true });
      return;
    }

    try {
      const parsed: unknown = JSON.parse(userData);
      if (!isUser(parsed)) throw new Error('Stored user data has an invalid shape.');
      set({ token, user: parsed, hydrated: true });
    } catch (error) {
      console.error('Unable to restore the saved session.', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null, hydrated: true });
    }
  },
}));