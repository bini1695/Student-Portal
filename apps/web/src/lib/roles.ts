import {
  LayoutDashboard, Users, ShieldCheck, Settings, ClipboardList, BookOpen,
  GraduationCap, CalendarDays, Wallet, FileText, UserCheck, Layers, Receipt, type LucideIcon,
} from "lucide-react";

export type Role = "super-admin" | "admin" | "department-head" | "teacher" | "student" | "accountant";

export const ROLES: Role[] = ["super-admin", "admin", "department-head", "teacher", "student", "accountant"];

/** Convert backend role names to the portal's URL slugs. */
export const toSlug = (value: string): Role => {
  const slug = value.toLowerCase().replace(/_/g, "-");
  return (slug === "dept-head" ? "department-head" : slug) as Role;
};

export const ROLE_LABEL: Record<Role, string> = {
  "super-admin": "Super Admin", admin: "Registrar", "department-head": "Department Head",
  teacher: "Teacher", student: "Student", accountant: "Accountant",
};

export interface Column { key: string; label: string; badge?: boolean; align?: "right" }
export interface NavItem {
  slug: string;            // URL segment: /{role}/{slug}
  label: string;
  icon: LucideIcon;
  endpoint?: string;       // backend list endpoint (paginated)
  columns?: Column[];
  title?: string; empty?: string;
}

const dash: NavItem = { slug: "", label: "Overview", icon: LayoutDashboard };

export const NAV: Record<Role, NavItem[]> = {
  "super-admin": [
    dash,
    { slug: "users", label: "Users & roles", icon: Users, endpoint: "/users",
      columns: [{ key: "fullName", label: "Name" }, { key: "email", label: "Email" }, { key: "role.name", label: "Role", badge: true }, { key: "status", label: "Status", badge: true }] },
    { slug: "security", label: "Security & logs", icon: ShieldCheck, endpoint: "/logs",
      columns: [{ key: "actor", label: "Actor" }, { key: "action", label: "Action" }, { key: "ip", label: "IP" }, { key: "createdAt", label: "When" }] },
    { slug: "roles", label: "Roles", icon: Settings, endpoint: "/roles",
      columns: [{ key: "name", label: "Role" }, { key: "description", label: "Description" }] },
  ],
  admin: [
    dash,
    { slug: "enrollment", label: "Enrollment requests", icon: ClipboardList },
    { slug: "students", label: "Student records", icon: GraduationCap, endpoint: "/students",
      columns: [{ key: "studentCode", label: "ID" }, { key: "userId", label: "User ID" }, { key: "departmentId", label: "Department" }, { key: "status", label: "Status", badge: true }] },
    { slug: "courses", label: "Course catalog", icon: BookOpen, endpoint: "/courses",
      columns: [{ key: "code", label: "Code" }, { key: "title", label: "Title" }, { key: "creditHours", label: "Credits" }, { key: "departmentId", label: "Department" }] },
    { slug: "timetable", label: "Course sections", icon: CalendarDays, endpoint: "/course-sections",
      columns: [{ key: "sectionName", label: "Section" }, { key: "courseId", label: "Course ID" }, { key: "room", label: "Room" }, { key: "capacity", label: "Capacity", align: "right" }] },
  ],
  "department-head": [
    dash,
    { slug: "enrollment", label: "Approvals", icon: UserCheck },
    { slug: "assignments", label: "Course sections", icon: Layers, endpoint: "/course-sections",
      columns: [{ key: "sectionName", label: "Section" }, { key: "courseId", label: "Course ID" }, { key: "teacherId", label: "Teacher ID" }, { key: "status", label: "Status", badge: true }] },
    { slug: "grades", label: "Grade approval", icon: FileText, endpoint: "/grades",
      columns: [{ key: "studentId", label: "Student ID" }, { key: "courseSectionId", label: "Section ID" }, { key: "grade", label: "Grade", badge: true }, { key: "status", label: "Status", badge: true }] },
  ],
  teacher: [
    dash,
    { slug: "classes", label: "My classes", icon: BookOpen, endpoint: "/course-sections",
      columns: [{ key: "sectionName", label: "Section" }, { key: "courseId", label: "Course ID" }, { key: "room", label: "Room" }, { key: "status", label: "Status", badge: true }] },
    { slug: "attendance", label: "Attendance", icon: UserCheck, endpoint: "/attendance",
      columns: [{ key: "studentId", label: "Student ID" }, { key: "courseSectionId", label: "Section ID" }, { key: "date", label: "Date" }, { key: "status", label: "Status", badge: true }] },
    { slug: "gradebook", label: "Gradebook", icon: FileText, endpoint: "/grades",
      columns: [{ key: "studentId", label: "Student ID" }, { key: "courseSectionId", label: "Section ID" }, { key: "score", label: "Score", align: "right" }, { key: "status", label: "Status", badge: true }] },
  ],
  student: [
    dash,
    { slug: "enrollment", label: "Course registration", icon: ClipboardList },
    { slug: "schedule", label: "My enrollment", icon: CalendarDays, endpoint: "/enrollments",
      columns: [{ key: "courseSectionId", label: "Course section ID" }, { key: "semesterId", label: "Semester ID" }, { key: "status", label: "Status", badge: true }, { key: "enrolledAt", label: "Enrolled" }] },
    { slug: "grades", label: "Grades & progress", icon: GraduationCap, endpoint: "/grades",
      columns: [{ key: "courseSectionId", label: "Section ID" }, { key: "score", label: "Score", align: "right" }, { key: "grade", label: "Grade", badge: true }, { key: "status", label: "Status", badge: true }] },
    { slug: "fees", label: "Fees & payments", icon: Wallet, endpoint: "/payments",
      columns: [{ key: "invoiceId", label: "Invoice ID" }, { key: "amount", label: "Amount", align: "right" }, { key: "method", label: "Method" }, { key: "status", label: "Status", badge: true }] },
  ],
  accountant: [
    dash,
    { slug: "invoices", label: "Invoices", icon: Receipt, endpoint: "/invoices",
      columns: [{ key: "studentId", label: "Student ID" }, { key: "amount", label: "Amount", align: "right" }, { key: "dueDate", label: "Due date" }, { key: "status", label: "Status", badge: true }] },
    { slug: "payments", label: "Payments", icon: Wallet, endpoint: "/payments",
      columns: [{ key: "invoiceId", label: "Invoice ID" }, { key: "amount", label: "Amount", align: "right" }, { key: "method", label: "Method" }, { key: "status", label: "Status", badge: true }] },
    { slug: "holds", label: "Account holds", icon: ShieldCheck, endpoint: "/financial-holds",
      columns: [{ key: "studentId", label: "Student ID" }, { key: "reason", label: "Reason" }, { key: "active", label: "Active", badge: true }] },
  ],
};
