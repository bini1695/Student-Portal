"use client";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Role } from "@/lib/roles";
import { EmptyState, Skeleton } from "./ui";

const TrendChart = dynamic(() => import("./TrendChart"), { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> });

type DashboardData = {
  cards?: [string, string, string][];
  trend?: { label: string; value: number }[];
  stats?: Record<string, string | number>;
};

export function Dashboard({ role }: { role: Role }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard", role],
    queryFn: async () => (await api.get<DashboardData>("/dashboard/me")).data,
  });
  const cards = data?.cards ?? Object.entries(data?.stats ?? {}).map(([label, value]) => [
    label.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase()),
    String(value),
    "",
  ] as [string, string, string]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-28" />)
          : cards.map(([label, value, note]) => (
              <div key={label} className="panel p-5">
                <p className="text-sm text-slate2-500">{label}</p>
                <p className="mt-2 font-serif text-3xl text-ink-900 tabular-nums">{value}</p>
                <p className="mt-1 text-xs text-slate2-500">{note}</p>
              </div>
            ))}
      </div>
      {isError && <p className="text-sm text-red-700">{error instanceof Error ? error.message : "Could not load dashboard data."}</p>}
      {!isLoading && !isError && cards.length === 0 && <EmptyState title="No dashboard metrics available" />}
      {data?.trend?.length ? <div className="panel p-5">
        <h2 className="mb-4 text-lg font-semibold">Activity over time</h2>
        <TrendChart data={data.trend} />
      </div> : null}
    </div>
  );
}
