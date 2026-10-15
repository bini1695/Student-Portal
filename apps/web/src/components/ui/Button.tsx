'use client';
import { Settings, Database, Shield, Globe, Bell, Mail } from 'lucide-react';

export default function SuperAdminSettingsPage() {
  const sections = [
    { icon: Globe, color: 'bg-blue-100 text-blue-600', title: 'General', desc: 'School name, logo, contact info, academic year settings.' },
    { icon: Database, color: 'bg-green-100 text-green-600', title: 'Database', desc: 'Backup, restore, and manage data.' },
    { icon: Shield, color: 'bg-purple-100 text-purple-600', title: 'Security', desc: 'Password policies, 2FA, session management.' },
    { icon: Bell, color: 'bg-yellow-100 text-yellow-600', title: 'Notifications', desc: 'Email, SMS, push notification settings.' },
    { icon: Mail, color: 'bg-red-100 text-red-600', title: 'Email', desc: 'SMTP configuration, templates.' },
    { icon: Settings, color: 'bg-indigo-100 text-indigo-600', title: 'Advanced', desc: 'Payment gateways, integrations, API keys.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure your system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="card hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${s.color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> These settings are coming soon. Contact your
          developer to enable full configuration options.
        </p>
      </div>
    </div>
  );
}
'use client';
import clsx from 'clsx';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ variant = 'primary', className, ...props }: Props) {
  return (
    <button
      className={clsx(
        'btn',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        variant === 'danger' && 'btn-danger',
        className,
      )}
      {...props}
    />
  );
}