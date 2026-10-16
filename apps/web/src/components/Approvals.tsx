"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { Badge, EmptyState, Skeleton } from "./ui";

interface Req { id: number; student: string; course: string; type: string; status: string }

/** Used by Registrar and Department Head. Backend decides what each role may see/approve. */
export function Approvals() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["enroll", "requests"],
    queryFn: async () => {
      const { data } = await api.get<{ id: number; studentId: number; courseSectionId: number; status: string }[]>("/enrollments");
      return data.filter((enrollment) => enrollment.status === "pending").map((enrollment): Req => ({
        id: enrollment.id,
        student: `Student #${enrollment.studentId}`,
        course: `Section #${enrollment.courseSectionId}`,
        type: "Course enrollment",
        status: enrollment.status,
      }));
    },
  });
  const decide = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "approved" | "rejected" }) => api.patch(`/enrollments/${id}`, { status }),
    onSuccess: (_r, v) => toast.success(v.status === "approved" ? "Request approved" : "Request rejected"),
    onError: (e) => toast.error(errorMessage(e)),
    onSettled: () => qc.invalidateQueries({ queryKey: ["enroll", "requests"] }),
  });

  return (
    <div className="panel">
      {isLoading && <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10" />)}</div>}
      {isError && <p className="p-5 text-sm text-red-700">{errorMessage(error)}</p>}
      {data?.length === 0 && <EmptyState title="All caught up" hint="New requests will appear here." />}
      <ul className="divide-y divide-chalk-200">
        {data?.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="font-medium text-ink-900">{r.student} · {r.course}</p>
              <p className="mt-0.5 text-sm text-slate2-500">{r.type} request <Badge>{r.status}</Badge></p>
            </div>
            <div className="flex gap-2">
              <button className="btn-danger" disabled={decide.isPending} onClick={() => decide.mutate({ id: r.id, status: "rejected" })}>Reject</button>
              <button className="btn-primary" disabled={decide.isPending} onClick={() => decide.mutate({ id: r.id, status: "approved" })}>Approve</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
