import { notFound } from "next/navigation";
import { Approvals } from "@/components/Approvals";
import { StudentEnrollment } from "@/components/StudentEnrollment";
import { PageHeader } from "@/components/ui";
import type { Role } from "@/lib/roles";

export default function Enrollment({ params }: { params: { role: Role } }) {
  if (params.role === "student")
    return (<><PageHeader title="Course registration" sub="Add or drop courses while registration is open." /><StudentEnrollment /></>);
  if (params.role === "admin" || params.role === "department-head")
    return (<><PageHeader title="Enrollment requests" sub="Review overload, prerequisite and late-add requests." /><Approvals /></>);
  notFound();
}
