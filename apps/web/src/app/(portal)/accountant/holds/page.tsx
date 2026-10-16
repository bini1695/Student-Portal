"use client";
import { Shell } from "@/components/Shell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, errorMessage } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

interface Hold {
  id: number;
  studentId: number;
  reason: string;
  amount: number;
  active: boolean;
  createdAt: string;
}

interface Student {
  id: number;
  studentCode: string;
  user?: {
    fullName: string;
  };
}

export default function AccountantHoldsPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [newHold, setNewHold] = useState({
    studentId: 0,
    reason: "Unpaid tuition fees",
    amount: 0,
  });

  // ✅ ከ Backend የ holds ዳታ አምጣ
  const { data: holds = [], isLoading, isError, error } = useQuery<Hold[]>({
    queryKey: ["financial-holds"],
    queryFn: async () => (await api.get("/financial-holds")).data,
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

  // ✅ Hold ፍጠር/አስተካክል (PATCH ብቻ)
  const setHold = useMutation({
    mutationFn: ({
      studentId,
      active,
      reason,
    }: {
      studentId: number;
      active: boolean;
      reason?: string;
    }) => api.patch(`/financial-holds/${studentId}`, { active, reason }),
    onSuccess: () => {
      toast.success("Hold updated successfully!");
      qc.invalidateQueries({ queryKey: ["financial-holds"] });
      setShowModal(false);
      setNewHold({ studentId: 0, reason: "Unpaid tuition fees", amount: 0 });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  // ✅ Hold አንቃ/አጥፋ
  const toggleHold = useMutation({
    mutationFn: ({ studentId, active }: { studentId: number; active: boolean }) =>
      api.patch(`/financial-holds/${studentId}`, { active }),
    onSuccess: () => {
      toast.success("Hold status updated!");
      qc.invalidateQueries({ queryKey: ["financial-holds"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const handleCreate = () => {
    if (!newHold.studentId) {
      toast.error("Please select a student");
      return;
    }
    setHold.mutate({
      studentId: newHold.studentId,
      active: true,
      reason: newHold.reason,
    });
  };

  const activeHolds = holds.filter((h) => h.active);
  const totalBlocked = activeHolds.reduce(
    (sum, h) => sum + Number(h.amount ?? 0),
    0
  );

  return (
    <Shell role="accountant">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">🚫 Account Holds</h1>
            <p className="text-slate2-500 mt-1">Manage financial holds on student accounts.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-md bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-800"
          >
            ➕ New Hold
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Active Holds</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{activeHolds.length}</p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Total Blocked</p>
            <p className="mt-2 text-xl font-bold text-ink-900">
              {totalBlocked.toLocaleString()} ETB
            </p>
          </div>
          <div className="rounded-lg border border-chalk-300 bg-white p-5">
            <p className="text-sm text-slate2-500">Resolved</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {holds.filter((h) => !h.active).length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
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

          {!isLoading && !isError && holds.length === 0 && (
            <div className="p-12 text-center text-slate2-500">
              No holds found. Click "New Hold" to create one.
            </div>
          )}

          {!isLoading && !isError && holds.length > 0 && (
            <div className="divide-y divide-chalk-200">
              {holds.map((h) => {
                const student = students.find((s) => s.id === h.studentId);
                return (
                  <div
                    key={h.id}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center ${
                      h.active ? "bg-red-50/30" : "hover:bg-chalk-50"
                    }`}
                  >
                    <div className="md:col-span-3">
                      <p className="font-medium text-ink-900">
                        {student?.user?.fullName ?? `Student #${h.studentId}`}
                      </p>
                      <p className="text-xs text-slate2-500">
                        ID: {h.studentId}
                        {student?.studentCode && ` · Code: ${student.studentCode}`}
                      </p>
                    </div>
                    <div className="md:col-span-4 text-slate2-500">{h.reason}</div>
                    <div className="md:col-span-2 md:text-right font-bold text-ink-900">
                      {Number(h.amount ?? 0).toLocaleString()} ETB
                    </div>
                    <div className="md:col-span-3 flex md:justify-end">
                      <button
                        onClick={() =>
                          toggleHold.mutate({ studentId: h.studentId, active: !h.active })
                        }
                        disabled={toggleHold.isPending}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-50 ${
                          h.active
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {h.active ? "🔒 Active" : "✓ Resolved"}
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
              <h2 className="text-xl font-bold text-ink-900 mb-4">Create New Hold</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-1">
                    Select Student *
                  </label>
                  <select
                    value={newHold.studentId || ""}
                    onChange={(e) =>
                      setNewHold({ ...newHold, studentId: parseInt(e.target.value) || 0 })
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

                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-1">Reason</label>
                  <select
                    value={newHold.reason}
                    onChange={(e) => setNewHold({ ...newHold, reason: e.target.value })}
                    className="w-full rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                  >
                    <option>Unpaid tuition fees</option>
                    <option>Library fines</option>
                    <option>Unpaid dormitory fees</option>
                    <option>Damaged property</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-900 mb-1">
                    Amount (ETB)
                  </label>
                  <input
                    type="number"
                    value={newHold.amount || ""}
                    onChange={(e) =>
                      setNewHold({ ...newHold, amount: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
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
                  onClick={handleCreate}
                  disabled={setHold.isPending || !newHold.studentId}
                  className="rounded-md bg-ink-900 px-4 py-2 text-sm text-white hover:bg-ink-800 disabled:opacity-50"
                >
                  {setHold.isPending ? "Creating..." : "Create Hold"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}