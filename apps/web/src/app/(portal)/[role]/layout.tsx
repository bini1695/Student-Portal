import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { ROLES, type Role } from "@/lib/roles";

export default function RoleLayout({ children, params }: { children: React.ReactNode; params: { role: string } }) {
  if (!ROLES.includes(params.role as Role)) notFound();
  return <Shell role={params.role as Role}>{children}</Shell>;
}
