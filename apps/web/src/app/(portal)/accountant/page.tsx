"use client";
import { Shell } from "@/components/Shell";
import { useQuery } from "@tanstack/react-query";
import { api, errorMessage } from "@/lib/api";
import Link from "next/link";

interface Payment {
  id: number;
  paymentNumber: string;
  invoiceId: number | null;
  studentId: number;
  amount: number;
  method: string;
  reference: string;
  status: string;
  paidAt: string;
}

interface InvoiceStats {
  total: number;
  totalAmount: number;
  paid: number;
  pending: number;
  overdue: number;
}

interface Hold {
  id: number;
  studentId: number;
  reason: string;
  amount: number;
  active: boolean;
  createdAt: string;
}

export default function AccountantOverviewPage() {
  // ✅ ከ Backend ክፍያዎችን አምጣ
  const {
    data: payments = [],
    isLoading: loadingPayments,
    isError: payError,
    error: payErr,
  } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => (await api.get("/payments")).data,
  });

  // ✅ ከ Backend የደረሰኝ ስታቲስቲክስ አምጣ
  const {
    data: invoiceStats,
    isLoading: loadingStats,
  } = useQuery<InvoiceStats>({
    queryKey: ["invoice-stats"],
    queryFn: async () => (await api.get("/invoices/stats")).data,
  });

  // ✅ ከ Backend የ hold ዳታ አምጣ
  const { data: holds = [] } = useQuery<Hold[]>({
    queryKey: ["financial-holds"],
    queryFn: async () => {
      try {
        return (await api.get("/financial-holds")).data;
      } catch {
        return [] as Hold[];
      }
    },
  });

  // ✅ ስሌቶች
  const totalRevenue = payments
    .filter((p) => p.status === "completed" || p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount ?? 0), 0);

  const pendingPayments = payments.filter((p) => p.status === "pending");
  const pendingAmount = pendingPayments.reduce(
    (sum, p) => sum + Number(p.amount ?? 0),
    0
  );

  const activeHolds = holds.filter((h) => h.active);
  const totalBlocked = activeHolds.reduce(
    (sum, h) => sum + Number(h.amount ?? 0),
    0
  );

  const isLoading = loadingPayments || loadingStats;

  return (
    <Shell role="accountant">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">💰 Accountant Dashboard</h1>
          <p className="text-slate2-500 mt-1">
            Track student payments and financial records.
          </p>
        </div>

        {/* Summary Cards */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-chalk-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-chalk-300 bg-white p-5">
              <p className="text-sm text-slate2-500">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {totalRevenue.toLocaleString()} ETB
              </p>
              <p className="text-xs text-slate2-500 mt-1">
                {payments.filter((p) => p.status === "completed" || p.status === "paid").length} payments
              </p>
            </div>

            <div className="rounded-lg border border-chalk-300 bg-white p-5">
              <p className="text-sm text-slate2-500">Pending</p>
              <p className="mt-2 text-2xl font-bold text-brass-600">
                {pendingAmount.toLocaleString()} ETB
              </p>
              <p className="text-xs text-slate2-500 mt-1">
                {pendingPayments.length} payments
              </p>
            </div>

            <div className="rounded-lg border border-chalk-300 bg-white p-5">
              <p className="text-sm text-slate-500">Overdue Invoices</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {invoiceStats?.overdue ?? 0}
              </p>
              <p className="text-xs text-slate2-500 mt-1">
                Total: {Number(invoiceStats?.totalAmount ?? 0).toLocaleString()} ETB
              </p>
            </div>

            <div className="rounded-lg border border-chalk-300 bg-white p-5">
              <p className="text-sm text-slate2-500">Active Holds</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {activeHolds.length}
              </p>
              <p className="text-xs text-slate2-500 mt-1">
                {totalBlocked.toLocaleString()} ETB blocked
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/accountant/invoices"
            className="rounded-lg border border-chalk-300 bg-white p-6 hover:border-brass-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🧾</span>
              <h3 className="font-bold text-ink-900">Manage Invoices</h3>
            </div>
            <p className="text-sm text-slate2-500">Create and track student invoices</p>
          </Link>

          <Link
            href="/accountant/payments"
            className="rounded-lg border border-chalk-300 bg-white p-6 hover:border-brass-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💳</span>
              <h3 className="font-bold text-ink-900">Record Payments</h3>
            </div>
            <p className="text-sm text-slate2-500">Track completed payments</p>
          </Link>

          <Link
            href="/accountant/holds"
            className="rounded-lg border border-chalk-300 bg-white p-6 hover:border-brass-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🚫</span>
              <h3 className="font-bold text-ink-900">Manage Holds</h3>
            </div>
            <p className="text-sm text-slate2-500">Financial holds on accounts</p>
          </Link>
        </div>

        {/* Recent Payments */}
        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <div className="border-b border-chalk-300 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-ink-900">💳 Recent Payments</h2>
            <Link
              href="/accountant/payments"
              className="text-sm font-medium text-brass-600 hover:underline"
            >
              View All →
            </Link>
          </div>

          {loadingPayments && (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-chalk-100 animate-pulse" />
              ))}
            </div>
          )}

          {payError && (
            <div className="p-6 text-sm text-red-600">
              Failed to load payments: {errorMessage(payErr)}
            </div>
          )}

          {!loadingPayments && !payError && payments.length === 0 && (
            <div className="p-12 text-center text-slate2-500">
              <p className="text-lg font-medium">No payments yet</p>
              <p className="text-sm mt-1">Payments will appear here once recorded.</p>
            </div>
          )}

          {!loadingPayments && !payError && payments.length > 0 && (
            <div className="divide-y divide-chalk-200">
              {payments.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-chalk-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-sm font-bold text-white">
                      {String(p.studentId).charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-ink-900">{p.paymentNumber}</p>
                      <p className="text-xs text-slate2-500">
                        Student ID: {p.studentId} · {p.method}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-ink-900">
                      {Number(p.amount).toLocaleString()} ETB
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        p.status === "completed" || p.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : p.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}