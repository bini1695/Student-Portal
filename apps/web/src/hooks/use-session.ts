"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toSlug, type Role } from "@/lib/roles";

export interface SessionUser { id: number; name: string; email: string; role: Role; department?: string }

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<SessionUser> => {
      const { data } = await api.get("/auth/me");
      const role = typeof data.role === "string" ? data.role : data.role?.name;
      return {
        id: data.id,
        name: data.fullName ?? data.name,
        email: data.email,
        role: toSlug(role),
        department: data.department?.name,
      };
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      qc.clear();
      window.location.href = "/login";
    }
  };
}
