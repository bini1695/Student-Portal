"use client";
import { Shell } from "@/components/Shell";

export default function StudentFeesPage() {
  return (
    <Shell role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">💰 Fees & Payments</h1>
          <p className="text-slate2-500 mt-1">Track your tuition and payment history.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Fees</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">5,000 ETB</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Paid</p>
            <p className="mt-2 text-2xl font-bold text-green-600">5,000 ETB</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Balance</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">0 ETB</p>
          </div>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">Payment History</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-chalk-200 bg-chalk-50 p-4">
              <div>
                <p className="font-bold text-ink-900">INV-001</p>
                <p className="text-sm text-slate2-500">2024-01-15</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-ink-900">5,000 ETB</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  paid
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}