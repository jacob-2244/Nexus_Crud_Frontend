// src/app/auth/superadmin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMenuByRole } from "@/lib/menuApi";
import { ShieldCheck } from "lucide-react";

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleLogin = async () => {
    if (!email || !password) { setMessage("Email and password are required"); return; }
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${apiUrl}/auth/superadmin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        setMessage(error.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      const { token, user } = await res.json();
      const menu = await fetchMenuByRole(user.role);
      login(user, menu, token);
      router.replace("/superadmin/view-permissions");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 w-full max-w-sm space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
              <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Super Admin</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Restricted access. Authorized personnel only.</p>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            type="email"
            placeholder="superadmin@nexus.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button
          className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Login as Super Admin"}
        </button>

        {message && <p className="text-red-500 text-sm text-center">{message}</p>}

        <p className="text-xs text-gray-400 text-center">
          <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push("/auth/login")}>
            ← Back to regular login
          </span>
        </p>
      </div>
    </div>
  );
}