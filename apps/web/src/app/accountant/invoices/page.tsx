'use client';

import Link from 'next/link';
import { ConfiguredResource } from '@/components/dashboard/ConfiguredResource';

export default function InvoicesPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link href="/accountant/invoices/new" className="btn btn-primary">Create invoice</Link>
      </div>
      <ConfiguredResource resource="invoices" />
    </div>
  );
}