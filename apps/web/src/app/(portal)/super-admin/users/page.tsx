"use client";
import { Shell } from "@/components/Shell";
import { useState } from "react";

export default function SuperAdminUsersPage() {
  const [search, setSearch] = useState("");
  const users = [
    { id: 1, name: "Hana Tesfaye", email: "hana@inu.edu.et", role: "Student", status: "active" },
    { id: 2, name: "Dr. Abebe Tadesse", email: "abebe@inu.edu.et", role: "Teacher", status: "active" },
    { id: 3, name: "Mekdes Alemu", email: "mekdes@inu.edu.et", role: "Admin", status: "active" },
    { id: 4, name: "Dr. Getachew Bekele", email: "getachew@inu.edu.et", role: "Dept Head", status: "active" },
    { id: 5, name: "Selam Haile", email: "selam@inu.edu.et", role: "Accountant", status: "active" },
    { id: 6, name: "Bekele Girma", email: "bekele@inu.edu.et", role: "Student", status: "pending" },
  ];

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search)
  );

  return (
    <Shell role="super-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">👥 Users & Roles</h1>
          <p className="text-slate2-500 mt-1">Manage all system users.</p>
        </div>

        <div className="rounded-lg border border-chalk-300 bg-white overflow-hidden">
          <div className="border-b border-chalk-300 p-5">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm rounded-md border border-chalk-300 px-4 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>

          <table className="w-full text-sm">
            <thead className="bg-chalk-50 text-xs uppercase text-slate2-500">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chalk-200">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-chalk-50">
                  <td className="px-6 py-4 font-medium text-ink-900">{u.name}</td>
                  <td className="px-6 py-4 text-slate2-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-brass-100 px-3 py-1 text-xs font-medium text-brass-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      u.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}