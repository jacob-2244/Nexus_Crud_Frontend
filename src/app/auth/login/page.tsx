// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMenuByRole } from "@/lib/menuApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleLogin = async () => {
    if (!email) { setMessage("Please enter your email"); return; }
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        setMessage(error.message || "Login failed");
        setLoading(false);
        return;
      }

      const { token, user } = await res.json();
      const menu = await fetchMenuByRole(user.role);
      login(user, menu, token);

      const firstPath = menu?.[0]?.href || "/dashboard";
      router.replace(firstPath);
    } catch (err) {
      setMessage(err instanceof Error && err.message === "Failed to fetch"
        ? `Cannot reach server at ${apiUrl}` : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">Login</h1>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button
          className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="text-red-500 text-sm text-center">{message}</p>}

        <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
          Don&apos;t have an account?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push("/auth/register")}>
            Register
          </span>
        </p>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-xs text-gray-400 text-center">
            Super Admin?{" "}
            <span className="text-indigo-600 cursor-pointer hover:underline" onClick={() => router.push("/auth/superadmin")}>
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}