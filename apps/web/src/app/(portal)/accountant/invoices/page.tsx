"use client";
import { Shell } from "@/components/Shell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, errorMessage } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

interface Invoice {
  id: number;
  invoiceNumber: string;
  studentId: number;
  amount: number;
  totalDue: number;
  amountPaid: number;
  discount: number;
  description: string;
  dueDate: string;
  issuedDate: string;
  status: string;
}

interface Student {
  id: number;
  studentCode: string;
  user?: {
    fullName: string;
  };
}

export default function AccountantInvoicesPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");

  const [newInvoice, setNewInvoice] = useState({
    studentId: 0,
    amount: 0,
    dueDate: "",
    description: "Semester II Tuition",
  });

  // ✅ ከ Backend የ invoices ዳታ አምጣ
  const { data: invoices = [], isLoading, isError, error } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => (await api.get("/invoices")).data,
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

  // ✅ አዲስ ደረሰኝ ፍጠር (ሁሉንም የግዴታ ቦታዎች ይላካል)
  const createInvoice = useMutation({
    mutationFn: (data: any) => api.post("/invoices", data),
    onSuccess: () => {
      toast.success("Invoice created successfully!");
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice-stats"] });
      setShowModal(false);
      setNewInvoice({
        studentId: 0,
        amount: 0,
        dueDate: "",
        description: "Semester II Tuition",
      });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  // ✅ እንደተከፈለ ምልክት አድርግ
  const markPaid = useMutation({
    mutationFn: (id: number) =>
      api.patch(`/invoices/${id}`, { status: "paid" }),
    onSuccess: () => {
      toast.success("Invoice marked as paid!");
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice-stats"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  // ✅ አጥፋ
  const deleteInvoice = useMutation({
    mutationFn: (id: number) => api.delete(`/invoices/${id}`),
    onSuccess: () => {
      toast.success("Invoice deleted!");
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice-stats"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  // ✅ የግዴታ ቦታዎችን በራስሰር አመንጭና ላክ
  const handleCreate = () => {
    if (!newInvoice.studentId || !newInvoice.amount || !newInvoice.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    // ✅ Invoice number በራስሰር ፍጠር
    const year = new Date().getFullYear();
    const uniqueNum = Date.now() % 1000000;
    const invoiceNumber = `INV-${year}-${String(uniqueNum).padStart(6, "0")}`;

    // ✅ ዛሬ ቀን
    const issuedDate = new Date().toISOString().split("T")[0];

    // ✅ Amount እና totalDue አስላ
    const amount = Number(newInvoice.amount);
    const discount = 0;
    const totalDue = amount - discount;

    createInvoice.mutate({
      invoiceNumber,
      studentId: newInvoice.studentId,
      amount,
      discount,
      totalDue,
      amountPaid: 0,
      issuedDate,
      dueDate: newInvoice.dueDate,
      description: newInvoice.description,
      status: "unpaid",
    });
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch = inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || inv.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: invoices.length,
    totalAmount: invoices.reduce((sum, i) => sum + Number(i.totalDue ?? 0), 0),
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "unpaid" || i.status === "partial").length,
  };

  return (
    <Shell role="accountant">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">🧾 Invoices</h1>
            <p className="text-slate2-500 mt-1">Create and manage student invoices.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-md bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-800"
          >
            ➕ New Invoice
          </button>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Invoices</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Amount</p>
            <p className="mt-2 text-xl font-bold text-ink-900">
              {stats.totalAmount.toLocaleString()} ETB
            </p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Paid</p>
            <p className="mt-2 text-2xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Pending</p>
            <p className="mt-2 text-2xl font-bold text-brass-600">{stats.pending}</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <div className="border-b border-chalk-300 p-5 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by invoice number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
            <div className="flex gap-2">
              {(["all", "paid", "pending", "overdue"] as const).map((f) => (
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
              No invoices found. Click "New Invoice" to create one.
            </div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <div className="divide-y divide-chalk-200">
              {filtered.map((inv) => {
                const student = students.find((s) => s.id === inv.studentId);
                return (
                  <div
                    key={inv.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-chalk-50"
                  >
                    <div className="md:col-span-2 font-bold text-ink-900">
                      {inv.invoiceNumber}
                    </div>
                    <div className="md:col-span-3">
                      <p className="font-medium text-ink-900">
                        {student?.user?.fullName ?? `Student #${inv.studentId}`}
                      </p>
                      <p className="text-xs text-slate2-500">{inv.description}</p>
                    </div>
                    <div className="md:col-span-2 md:text-right font-bold text-ink-900">
                      {Number(inv.totalDue ?? inv.amount).toLocaleString()} ETB
                    </div>
                    <div className="md:col-span-2 md:text-center text-slate2-500">
                      {inv.dueDate
                        ? new Date(inv.dueDate).toLocaleDateString()
                        : "—"}
                    </div>
                    <div className="md:col-span-2 md:text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : inv.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div className="md:col-span-1 flex md:justify-end gap-2">
                      {inv.status !== "paid" && (
                        <button
                          onClick={() => markPaid.mutate(inv.id)}
                          disabled={markPaid.isPending}
                          className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                          title="Mark as Paid"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() =>
                          confirm("Delete this invoice?") && deleteInvoice.mutate(inv.id)
                        }
                        disabled={deleteInvoice.isPending}
                        className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50"
                        title="Delete"
                      >
                        🗑
                      </button>
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
              <h2 className="text-xl font-bold text-ink-900 mb-4">Create New Invoice</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-1">
                    Select Student *
                  </label>
                  <select
                    value={newInvoice.studentId || ""}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
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
                  <p className="text-xs text-slate2-500 mt-1">
                    Only students registered in the system appear here.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-ink-900 mb-1">
                      Amount (ETB) *
                    </label>
                    <input
                      type="number"
                      value={newInvoice.amount || ""}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          amount: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-900 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) =>
                        setNewInvoice({ ...newInvoice, dueDate: e.target.value })
                      }
                      className="w-full rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-1">
                    Description
                  </label>
                  <select
                    value={newInvoice.description}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, description: e.target.value })
                    }
                    className="w-full rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                  >
                    <option>Semester II Tuition</option>
                    <option>Dormitory Fee</option>
                    <option>Library Fee</option>
                    <option>Registration Fee</option>
                  </select>
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
                  onClick={handleCreate}
                  disabled={createInvoice.isPending || !newInvoice.studentId}
                  className="rounded-md bg-ink-900 px-4 py-2 text-sm text-white hover:bg-ink-800 disabled:opacity-50"
                >
                  {createInvoice.isPending ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}