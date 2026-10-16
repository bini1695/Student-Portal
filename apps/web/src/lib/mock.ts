// Demo adapter used when NEXT_PUBLIC_USE_MOCKS=true.
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";

const names = ["Hana Tesfaye", "Samuel Bekele", "Marta Alemu", "Dawit Girma", "Selam Tadesse", "Yonas Haile", "Ruth Mekonnen", "Abel Kassa", "Liya Worku", "Naol Desta", "Betty Assefa", "Eyob Negash"];
const statuses = ["Active", "Pending", "Suspended", "Graduated"];
const rows = <T extends object>(n: number, f: (i: number) => T): Array<{ id: number } & T> =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, ...f(i) }));

let sections = rows(8, (i) => ({
  code: ["CS201", "MATH210", "ENG101", "PHY120", "CS305", "STAT220", "ECON101", "CS410"][i],
  title: ["Data Structures", "Linear Algebra", "Academic Writing", "Mechanics", "Databases", "Statistics", "Microeconomics", "Software Engineering"][i],
  credits: 3, schedule: ["Mon/Wed 09:00", "Tue/Thu 11:00", "Fri 14:00", "Mon/Wed 14:00"][i % 4],
  seats: 40 - i * 3, taken: 28 + i, teacher: names[i],
}));
let enrollments = [
  { id: 1, studentId: 1, courseSectionId: 1, status: "approved" },
  { id: 2, studentId: 1, courseSectionId: 3, status: "approved" },
  { id: 3, studentId: 2, courseSectionId: 2, status: "pending" },
];
export const stats: Record<string, unknown> = {
  "super-admin": { cards: [["Active users", "4,812", "+126 this term"], ["Roles", "6", "all configured"], ["Last backup", "02:00", "today · 18.4 GB"], ["Failed logins (24h)", "37", "−12% vs yesterday"]] },
  admin: { cards: [["Applications", "312", "48 awaiting review"], ["Enrolled", "3,946", "this term"], ["Open sections", "186", "11 nearly full"], ["Holds", "94", "unpaid fees"]] },
  "department-head": { cards: [["Pending approvals", "14", "5 overload requests"], ["Pass rate", "87%", "+2.1 pts"], ["Grade sheets", "6", "awaiting review"], ["Capacity used", "81%", "across 32 sections"]] },
  teacher: { cards: [["My sections", "4", "126 students"], ["Next class", "09:00", "CS201 · Room B12"], ["Ungraded items", "38", "2 assignments"], ["Attendance today", "92%", "CS305"]] },
  student: { cards: [["Credits enrolled", "15", "of 18 max"], ["Cumulative GPA", "3.42", "+0.08 last term"], ["Credits completed", "78", "of 120"], ["Balance due", "$320", "due 30 Oct"]] },
  accountant: { cards: [["Collected (term)", "$1.24M", "86% of billed"], ["Outstanding", "$198k", "612 students"], ["Payments today", "73", "$41.2k"], ["Overdue > 30d", "128", "hold candidates"]] },
  trend: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"].map((m, i) => ({ label: m, value: [320, 410, 380, 520, 610, 580][i] })),
};

function respond(config: InternalAxiosRequestConfig) {
  const url = (config.url || "").split("?")[0];
  const method = (config.method || "get").toLowerCase();
  const params = new URLSearchParams((config.url || "").split("?")[1] || "");
  const page = Number(config.params?.page ?? params.get("page") ?? 1), limit = Number(config.params?.limit ?? 8);
  const search = String(config.params?.search ?? "").toLowerCase();
  const token = document.cookie.match(/access_token=[^.]+\.([^.;]+)/)?.[1];
  const currentUser = token
    ? JSON.parse(atob(token.replace(/-/g, "+").replace(/_/g, "/")))
    : null;

  if (url === "/auth/me") {
    return currentUser;
  }
  if (url === "/dashboard/me") return stats[String(currentUser?.role ?? "STUDENT").toLowerCase().replace(/_/g, "-")] ?? stats.student;
  if (url === "/course-sections") return sections;
  if (url === "/courses") return sections.map(({ id, code, title, credits }) => ({ id, code, title, creditHours: credits }));
  if (url === "/enrollments" && method === "get") {
    return currentUser?.role === "STUDENT" ? enrollments.filter((item) => item.studentId === currentUser.id) : enrollments;
  }
  if (url === "/enrollments" && method === "post") {
    const courseSectionId = JSON.parse(config.data).courseSectionId;
    const enrollment = { id: Date.now(), studentId: currentUser?.id ?? 1, courseSectionId, status: "pending" };
    enrollments = [...enrollments, enrollment];
    return enrollment;
  }
  if (url.startsWith("/enrollments/") && method === "patch") {
    const id = Number(url.split("/")[2]);
    const update = JSON.parse(config.data);
    enrollments = enrollments.map((item) => item.id === id ? { ...item, ...update } : item);
    return enrollments.find((item) => item.id === id);
  }
  // Generic paginated list for every resource table
  const all = rows(37, (i) => ({
    name: names[i % names.length], email: `user${i}@campus.edu`, role: ["STUDENT", "TEACHER", "ADMIN"][i % 3],
    status: statuses[i % 4], studentNo: `UGR/${1000 + i}/16`, program: ["Computer Science", "Accounting", "Nursing"][i % 3],
    code: `CRS${100 + i}`, title: sections[i % 8].title, credits: 3, department: "Computing", course: sections[i % 8].title,
    room: `B${10 + (i % 6)}`, schedule: sections[i % 4].schedule, seats: 40 - (i % 20), enrolled: 100 + i * 7, term: "2026 Fall",
    teacher: names[(i + 3) % names.length], section: `S${(i % 3) + 1}`, students: 30 + i, passRate: `${80 + (i % 15)}%`, capacity: `${60 + (i % 35)}%`,
    actor: names[i % names.length], action: ["Login", "Role changed", "Backup run", "Grade posted"][i % 4], ip: `10.0.${i % 9}.${i + 10}`,
    createdAt: `2026-10-${String((i % 28) + 1).padStart(2, "0")}`, size: `${(12 + i / 10).toFixed(1)} GB`, key: `setting.${i}`, value: "enabled",
    date: `2026-10-${String((i % 28) + 1).padStart(2, "0")}`, present: 28 - (i % 5), absent: i % 5, student: names[i % names.length],
    score: 55 + (i % 45), grade: ["A", "B+", "B", "A-", "C+"][i % 5], day: ["Mon", "Tue", "Wed"][i % 3], time: "09:00–10:30",
    description: ["Tuition", "Library fee", "Lab fee"][i % 3], amount: `$${(120 + i * 13).toFixed(2)}`, method: ["Card", "Bank", "Mobile"][i % 3],
    balance: `$${(80 + i * 9).toFixed(2)}`,
  })).map((r) => ({ ...r, status: r.status === "Graduated" ? "Paid" : r.status }));
  const filtered = search ? all.filter((r) => JSON.stringify(r).toLowerCase().includes(search)) : all;
  return { data: filtered.slice((page - 1) * limit, page * limit), meta: { total: filtered.length, page, limit } };
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((r) => setTimeout(r, 250));
  try {
    const data = respond(config);
    return { data, status: 200, statusText: "OK", headers: {}, config };
  } catch (e: any) {
    return Promise.reject({ response: { status: e.status ?? 500, data: { message: e.message } }, config, isAxiosError: true });
  }
};
