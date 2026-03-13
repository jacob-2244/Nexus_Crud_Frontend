// src/app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/User";
import { fetchMenuByRole } from "@/lib/menuApi";

// Superadmin is never available for self-registration
const REGISTERABLE_ROLES = [
  { value: UserRole.ADMIN,   label: "Admin" },
  { value: UserRole.MANAGER, label: "Manager" },
  { value: UserRole.GUEST,   label: "Guest" },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.MANAGER);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const { login } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleRegister = async () => {
    if (!name || !email || !role) { setMessage("All fields are required"); return; }
    if (role === UserRole.SUPERADMIN) { setMessage("Invalid role"); return; }

    setLoading(true);
    setMessage("");

    try {
      const createRes = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });

      if (!createRes.ok) {
        const error = await createRes.json().catch(() => ({}));
        setMessage(error.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Log in after registration to get JWT
      const loginRes = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!loginRes.ok) {
        setMessage("Registered! Please log in manually.");
        router.push("/auth/login");
        return;
      }

      const { token, user } = await loginRes.json();
      const menu = await fetchMenuByRole(user.role);
      login(user, menu, token);
      router.replace(menu?.[0]?.href || "/dashboard");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">Register</h1>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            type="text" placeholder="Your name"
            value={name} onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            type="email" placeholder="email@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
          <select
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={role} onChange={(e) => setRole(e.target.value as UserRole)}
          >
            {REGISTERABLE_ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <button
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          onClick={handleRegister} disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p className="text-red-500 text-sm text-center">{message}</p>}

        <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push("/auth/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}