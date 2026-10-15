'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, Home } from 'lucide-react';
import axios from 'axios';
import api from '@/lib/api';
import { INULogo } from '@/components/ui/INULogo';
import { useAuth, type User } from '@/store/authStore';

const ROLE_ROUTES: Record<string, string> = {
  super_admin: '/super-admin',
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
  accountant: '/accountant',
  dept_head: '/dept-head',
};

function normalizeRole(value: unknown): string | null {
  const roleName =
    typeof value === 'string'
      ? value
      : typeof value === 'object' && value !== null && 'name' in value
        ? (value as { name?: unknown }).name
        : null;
  return typeof roleName === 'string'
    ? roleName.trim().toLowerCase().replace(/[\s-]+/g, '_')
    : null;
}

function normalizeLoginUser(value: unknown): User | null {
  if (typeof value !== 'object' || value === null) return null;
  const user = value as Record<string, unknown>;
  const id = typeof user.id === 'number' ? user.id : Number(user.id);
  const role = normalizeRole(user.role);
  if (
    !Number.isFinite(id) ||
    typeof user.email !== 'string' ||
    typeof user.fullName !== 'string' ||
    !role
  ) return null;

  return {
    id,
    email: user.email,
    fullName: user.fullName,
    role,
    roleId: typeof user.roleId === 'number' ? user.roleId : undefined,
    phone: typeof user.phone === 'string' || user.phone === null ? user.phone : undefined,
  };
}

function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'Unable to sign in. Please try again.';
  if (!error.response) return 'Could not connect to the sign-in server. Check that the API is running and try again.';
  const message = error.response.data?.message;
  if (Array.isArray(message)) return message.join(' ');
  return typeof message === 'string' ? message : 'Unable to sign in. Please try again.';
}

export default function LoginPage() {
  const login = useAuth((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = normalizeLoginUser(JSON.parse(userData));
        const target = user ? ROLE_ROUTES[user.role] : undefined;
        if (user && target) {
          document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `user_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
          window.location.replace(target);
          return;
        }
      } catch (parseError) {
        console.error('Unable to restore the saved login session.', parseError);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
    setChecked(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email: email.trim(), password });
      const payload = res.data as {
        accessToken?: string;
        token?: string;
        user?: unknown;
      };
      const accessToken = payload.accessToken ?? payload.token;
      const user = normalizeLoginUser(payload.user);

      if (!accessToken || !user) {
        setError('The server returned an invalid login response. Please try again.');
        return;
      }

      const target = ROLE_ROUTES[user.role];
      if (!target) {
        setError('This account does not have access to a portal dashboard.');
        return;
      }

      login(accessToken, user);
      window.location.assign(target);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Header with INU branding */}
      <div className="text-center mb-8">
        <div className="inline-flex mb-4">
          <INULogo size={72} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <LogIn size={18} />
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </form>

      {/* ============================================
          BACK TO HOME LINK — AT THE BOTTOM
      ============================================ */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        © {new Date().getFullYear()} Injibara University
      </p>
    </div>
  );
}
