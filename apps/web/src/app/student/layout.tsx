import { DashboardShell } from '@/components/layout/DashboardShell';

export default function RoleLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}