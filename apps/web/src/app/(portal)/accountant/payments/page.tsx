"use client";
import { Shell } from "@/components/Shell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, errorMessage } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

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

interface Student {
  id: number;
  studentCode: string;
  user?: {
    fullName: string;
  };
}

export default function AccountantPaymentsPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "failed">("all");

  const [newPayment, setNewPayment] = useState({
    studentId: 0,
    invoiceId: null as number | null,
    amount: 0,
    method: "Bank Transfer",
    reference: "",
  });

  // ✅ ከ Backend የ payments ዳታ አምጣ
  const { data: payments = [], isLoading, isError, error } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => (await api.get("/payments")).data,
  });

  // ✅ ከ Backend የተማሪዎችን ዝርዝር አምጣ (ለ dropdown)
  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      try {
        return (await api.get("/students")).data;
      } catch {
        return [] as Student[];
      }
    },
  });

  // ✅ አዲስ ክፍያ መዝግብ
  const recordPayment = useMutation({
    mutationFn: (data: any) => api.post("/payments", data),
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["payment-stats"] });
      setShowModal(false);
      setNewPayment({
        studentId: 0,
        invoiceId: null,
        amount: 0,
        method: "Bank Transfer",
        reference: "",
      });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const handleRecord = () => {
    if (!newPayment.studentId || !newPayment.amount) {
      toast.error("Please fill required fields");
      return;
    }
    recordPayment.mutate({
      studentId: newPayment.studentId,
      invoiceId: newPayment.invoiceId || undefined,
      amount: newPayment.amount,
      method: newPayment.method,
      reference: newPayment.reference || undefined,
    });
  };

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.paymentNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.reference?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalCompleted = payments
    .filter((p) => p.status === "completed" || p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <Shell role="accountant">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">💳 Payments</h1>
            <p className="text-slate2-500 mt-1">Record and track student payments.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-md bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-800"
          >
            ➕ Record Payment
          </button>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Payments</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">{payments.length}</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Collected</p>
            <p className="mt-2 text-xl font-bold text-green-600">
              {totalCompleted.toLocaleString()} ETB
            </p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Pending</p>
            <p className="mt-2 text-2xl font-bold text-brass-600">
              {payments.filter((p) => p.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <div className="border-b border-chalk-300 p-5 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by payment ID or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
            <div className="flex gap-2">
              {(["all", "completed", "pending", "failed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-4 py-2.5 text-xs font-medium capitalize ${
                    filter === f
                      ? "bg-ink-900 text-white"
                      : "bg-chalk-100 text-slate2-500 hover:bg-chalk-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-chalk-100 animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-6 text-sm text-red-600">{errorMessage(error)}</div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="p-12 text-center text-slate2-500">
              No payments found. Click "Record Payment" to start.
            </div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <div className="divide-y divide-chalk-200">
              {filtered.map((p) => {
                const student = students.find((s) => s.id === p.studentId);
                return (
                  <div
                    key={p.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-chalk-50"
                  >
                    <div className="md:col-span-2">
                      <p className="font-bold text-ink-900">{p.paymentNumber}</p>
                      <p className="text-xs text-slate2-500">{p.reference || "—"}</p>
                    </div>
                    <div className="md:col-span-3">
                      <p className="font-medium text-ink-900">
                        {student?.user?.fullName ?? `Student #${p.studentId}`}
                      </p>
                      <p className="text-xs text-slate2-500">
                        {student?.studentCode ?? ""}
                      </p>
                    </div>
                    <div className="md:col-span-2 md:text-right font-bold text-ink-900">
                      {Number(p.amount).toLocaleString()} ETB
                    </div>
                    <div className="md:col-span-2 md:text-center text-slate2-500">
                      {p.method}
                    </div>
                    <div className="md:col-span-2 md:text-center text-slate2-500">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString()
                        : "—"}
                    </div>
                    <div className="md:col-span-1 md:text-center">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
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
                );
              })}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-lg max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-ink-900 mb-4">Record Payment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-1">
                    Select Student *
                  </label>
                  <select
                    value={newPayment.studentId || ""}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        studentId: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                  >
                    <option value="">-- Choose a student --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.user?.fullName ?? "Unknown"} ({s.studentCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-1">
                    Amount (ETB) *
                  </label>
                  <input
                    type="number"
                    value={newPayment.amount || ""}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        amount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newPayment.method}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, method: e.target.value })
                    }
                    className="w-full rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                  >
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Telebirr</option>
                    <option>CBE Birr</option>
                    <option>Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-1">
                    Reference (optional)
                  </label>
                  <input
                    type="text"
                    value={newPayment.reference}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, reference: e.target.value })
                    }
                    placeholder="TXN-123456"
                    className="w-full rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-md border border-chalk-300 px-4 py-2 text-sm hover:bg-chalk-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecord}
                  disabled={recordPayment.isPending || !newPayment.studentId}
                  className="rounded-md bg-ink-900 px-4 py-2 text-sm text-white hover:bg-ink-800 disabled:opacity-50"
                >
                  {recordPayment.isPending ? "Recording..." : "Record Payment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}