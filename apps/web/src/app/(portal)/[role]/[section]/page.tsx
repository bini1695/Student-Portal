import { notFound } from "next/navigation";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/ui";
import { NAV, type Role } from "@/lib/roles";

// One config-driven page serves every list screen. Add a screen by adding an entry in lib/roles.ts.
export default function Section({ params }: { params: { role: Role; section: string } }) {
  const item = NAV[params.role]?.find((n) => n.slug === params.section);
  if (!item?.endpoint || !item.columns) notFound();
  return (
    <>
      <PageHeader title={item.label} />
      <DataTable endpoint={item.endpoint} columns={item.columns} empty={item.empty} />
    </>
  );
}
