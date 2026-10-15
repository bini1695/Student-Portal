'use client';
import { AlertCircle, ClipboardList, DollarSign, Receipt, Wallet } from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export default function AccountantDashboard() {
  return (
    <DashboardOverview
      title="Accountant Dashboard"
      stats={[
        { key: 'totalInvoices', label: 'Invoices', icon: ClipboardList, color: 'blue' },
        { key: 'totalPayments', label: 'Payments', icon: Receipt, color: 'purple' },
        { key: 'totalBilled', label: 'Total billed', icon: Wallet, color: 'yellow', currency: true },
        { key: 'totalCollected', label: 'Collected', icon: DollarSign, color: 'green', currency: true },
        { key: 'outstanding', label: 'Outstanding', icon: AlertCircle, color: 'red', currency: true },
      ]}
      shortcuts={[
        { label: 'Fee structures', href: '/accountant/fee-structures' },
        { label: 'Invoices', href: '/accountant/invoices' },
        { label: 'Record payment', href: '/accountant/payments/new' },
        { label: 'Financial reports', href: '/accountant/reports' },
      ]}
    />
  );
}