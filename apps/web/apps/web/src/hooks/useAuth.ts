'use client';
import { useEffect } from 'react';
import { useAuth as useAuthStore } from '@/store/authStore';

export function useAuth() {
  const store = useAuthStore();
  useEffect(() => {
    if (!store.hydrated) store.loadFromStorage();
  }, [store]);
  return store;
}