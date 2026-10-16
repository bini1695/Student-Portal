"use client";
import { useState, useDeferredValue } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { api, errorMessage, type Paginated } from "@/lib/api";
import type { Column } from "@/lib/roles";
import { Badge, EmptyState, Skeleton } from "./ui";

/** Server-paginated table. Expects Nest responses shaped { data: T[], meta: { total, page, limit } }. */
export function DataTable({ endpoint, columns, empty, limit = 8 }: { endpoint: string; columns: Column[]; empty?: string; limit?: number }) {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const search = useDeferredValue(q);

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["list", endpoint, page, search],
    placeholderData: keepPreviousData,   // old page stays visible while the next loads
    queryFn: async () => {
      const payload = (await api.get<Paginated<Record<string, any>> | Record<string, any>[]>(endpoint, {
        params: { page, limit, search: search || undefined },
      })).data;
      if (Array.isArray(payload)) {
        const filtered = search
          ? payload.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()))
          : payload;
        return {
          data: filtered.slice((page - 1) * limit, page * limit),
          meta: { total: filtered.length, page, limit },
        };
      }
      if (Array.isArray(payload.data) && payload.meta) return payload;
      throw new Error("The API returned an unsupported list response.");
    },
  });

  const pages = data ? Math.max(1, Math.ceil(data.meta.total / data.meta.limit)) : 1;

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-3 border-b border-chalk-200 p-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate2-500" aria-hidden />
          <input aria-label="Search" className="input pl-9" placeholder="Search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        {isFetching && <span className="text-xs text-slate2-500" role="status">Updating…</span>}
      </div>

      {isError ? (
        <div className="p-6 text-sm">
          <p className="text-red-700">{errorMessage(error)}</p>
          <button className="btn-ghost mt-3" onClick={() => refetch()}>Retry</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-chalk-50 text-left text-slate2-500">
              <tr>{columns.map((c) => <th key={c.key} scope="col" className={clsx("px-4 py-2.5 font-medium", c.align === "right" && "text-right")}>{c.label}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-chalk-200">
              {isLoading
                ? Array.from({ length: 6 }, (_, i) => <tr key={i}>{columns.map((c) => <td key={c.key} className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>)}</tr>)
                : data?.data.map((row, i) => (
                    <tr key={row.id ?? i} className="hover:bg-chalk-50">
                      {columns.map((c) => (
                        <td key={c.key} className={clsx("px-4 py-3", c.align === "right" && "text-right tabular-nums")}>
                          {c.badge ? <Badge>{displayValue(row, c.key)}</Badge> : displayValue(row, c.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
          {data && data.data.length === 0 && <EmptyState title={empty ?? "Nothing here yet"} hint={search ? "Try a different search." : undefined} />}
        </div>
      )}

      {data && data.meta.total > 0 && (
        <div className="flex items-center justify-between border-t border-chalk-200 px-4 py-2.5 text-sm text-slate2-500">
          <span>{(page - 1) * data.meta.limit + 1}–{Math.min(page * data.meta.limit, data.meta.total)} of {data.meta.total}</span>
          <div className="flex gap-1">
            <button className="btn-ghost px-2" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></button>
            <button className="btn-ghost px-2" aria-label="Next page" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function displayValue(row: Record<string, any>, key: string): string {
  const value = key.split(".").reduce<unknown>((current, part) => {
    if (typeof current !== "object" || current === null || !(part in current)) return undefined;
    return (current as Record<string, unknown>)[part];
  }, row);
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") {
    const display = value as { name?: unknown; fullName?: unknown; id?: unknown };
    return String(display.name ?? display.fullName ?? display.id ?? "—");
  }
  return String(value);
}
