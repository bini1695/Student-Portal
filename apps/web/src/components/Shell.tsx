"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import clsx from "clsx";
import { NAV, ROLE_LABEL, type Role } from "@/lib/roles";
import { useLogout, useSession } from "@/hooks/use-session";

export function Shell({ role, children }: { role: Role; children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { data: user } = useSession();
  const logout = useLogout();

  const nav = (
    <nav aria-label="Main" className="flex-1 space-y-0.5 px-3">
      {NAV[role].map((n) => {
        const href = `/${role}${n.slug ? `/${n.slug}` : ""}`;
        const active = n.slug ? path.startsWith(href) : path === href;
        const Icon = n.icon;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active ? "bg-ink-700 text-white" : "text-chalk-300 hover:bg-ink-800 hover:text-white"
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
            <span>{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const initials = (user?.name ?? "").split(" ").map((s) => s[0]).slice(0, 2).join("");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-ink-900 py-5 transition-transform lg:static lg:w-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center justify-between px-6">
          <div>
            <p className="font-serif text-xl text-white">Campus Portal</p>
            <p className="text-xs text-brass-400">{ROLE_LABEL[role]}</p>
          </div>
          <button className="text-chalk-300 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        {nav}
        <div className="mx-3 mt-4 flex items-center gap-3 rounded-md bg-ink-950 p-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brass-500 text-xs font-semibold text-ink-950">
            {initials || "·"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white">{user?.name ?? "…"}</p>
            <p className="truncate text-xs text-chalk-300">{user?.email}</p>
          </div>
          <button onClick={logout} aria-label="Sign out" className="text-chalk-300 hover:text-white">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="min-w-0">
        <header className="flex items-center gap-3 border-b border-chalk-300 bg-white px-4 py-3 lg:hidden">
          <button aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif text-lg text-ink-900">Campus Portal</span>
        </header>
        <main className="mx-auto max-w-6xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}