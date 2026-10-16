import clsx from "clsx";
import type { ReactNode } from "react";

const tone: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 border-emerald-200", paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200", success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  pending: "bg-amber-50 text-amber-800 border-amber-200", draft: "bg-amber-50 text-amber-800 border-amber-200",
  suspended: "bg-red-50 text-red-800 border-red-200", rejected: "bg-red-50 text-red-800 border-red-200", overdue: "bg-red-50 text-red-800 border-red-200", failed: "bg-red-50 text-red-800 border-red-200",
};
export function Badge({ children }: { children: ReactNode }) {
  const k = String(children).toLowerCase();
  return <span className={clsx("inline-block rounded border px-2 py-0.5 text-xs font-medium", tone[k] ?? "bg-chalk-100 text-slate2-700 border-chalk-300")}>{children}</span>;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded bg-chalk-200", className)} />;
}

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 max-w-prose text-sm text-slate2-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-serif text-lg text-ink-900">{title}</p>
      {hint && <p className="mt-1 text-sm text-slate2-500">{hint}</p>}
    </div>
  );
}
