'use client';
import { useEffect, useState } from 'react';
import {
  Users, GraduationCap, BookOpen, Building2, Layers, Shield,
  Settings, Activity, Bell,
} from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, usersRes] = await Promise.all([
          api.get('/dashboard/me'),
          api.get('/users'),
        ]);
        setStats(dashRes.data?.stats || {});
        setUsers(usersRes.data || []);
      } catch (err: any) {
        console.error('Super admin error:', err);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: 'Active Users', value: stats?.activeUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Students', value: stats?.totalStudents, icon: GraduationCap, color: 'bg-green-100 text-green-600' },
    { label: 'Teachers', value: stats?.totalTeachers, icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Courses', value: stats?.totalCourses, icon: BookOpen, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Departments', value: stats?.totalDepartments, icon: Building2, color: 'bg-red-100 text-red-600' },
    { label: 'Sections', value: stats?.totalSections, icon: Layers, color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Full system overview and control</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card flex items-center gap-4 hover:shadow-md transition">
              <div className={`p-3 rounded-xl ${c.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? '—' : c.value ?? 0}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/super-admin/users" className="card hover:shadow-md transition text-center">
          <Users className="mx-auto text-blue-600 mb-2" size={24} />
          <p className="text-sm font-medium">Manage Users</p>
        </a>
        <a href="/super-admin/departments" className="card hover:shadow-md transition text-center">
          <Building2 className="mx-auto text-green-600 mb-2" size={24} />
          <p className="text-sm font-medium">Departments</p>
        </a>
        <a href="/super-admin/roles" className="card hover:shadow-md transition text-center">
          <Shield className="mx-auto text-purple-600 mb-2" size={24} />
          <p className="text-sm font-medium">Roles</p>
        </a>
        <a href="/super-admin/settings" className="card hover:shadow-md transition text-center">
          <Settings className="mx-auto text-yellow-600 mb-2" size={24} />
          <p className="text-sm font-medium">Settings</p>
        </a>
      </div>

      {/* Recent Users */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} /> Recent Users
          </h2>
          <a href="/super-admin/users" className="text-sm text-blue-600 hover:underline">
            View all →
          </a>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No users yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs text-gray-500 uppercase border-b">
                <tr>
                  <th className="text-left py-3">ID</th>
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Email</th>
                  <th className="text-left py-3">Role</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 8).map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 text-sm">#{u.id}</td>
                    <td className="py-3 font-medium">{u.fullName}</td>
                    <td className="py-3 text-sm text-gray-500">{u.email}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                        {u.role?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          u.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System health */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity size={20} /> System Health
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-500">API process memory</p>
            <p className="font-bold text-green-700">
              {loading ? '—' : `${stats?.serverMemoryUsedMb ?? '—'} / ${stats?.serverMemoryTotalMb ?? '—'} MB`}
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500">Process memory load</p>
            <p className="font-bold text-blue-700">{loading ? '—' : `${stats?.serverLoadPercent ?? '—'}%`}</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-gray-500">Database storage</p>
            <p className="font-bold text-purple-700">{loading ? '—' : `${stats?.databaseStorageMb ?? '—'} MB`}</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-gray-500">Server uptime</p>
            <p className="font-bold text-yellow-700">
              {loading ? '—' : `${Math.floor((stats?.serverUptimeSeconds ?? 0) / 3600)}h ${Math.floor(((stats?.serverUptimeSeconds ?? 0) % 3600) / 60)}m`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}