"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/User";
import { fetchMenuByRole } from "@/lib/menuApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleLogin = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${apiUrl}/users/login`, {
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

      const user: User = await res.json();
      const menu = await fetchMenuByRole(user.role);
      login(user, menu);

      const firstPath = menu?.[0]?.href || "/dashboard";
      router.replace(firstPath);
    } catch (err) {
      console.error(err);
      setMessage(
        err instanceof Error && err.message === "Failed to fetch"
          ? `Cannot reach server. Make sure backend is running at ${apiUrl}`
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Login</h1>
      <input
        className="p-2 border rounded w-64"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="text-gray-700 dark:text-gray-300">
        Don&apos;t have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => router.push("/auth/register")}
        >
          Register
        </span>
      </p>
      {message && <p className="text-red-500">{message}</p>}
    </div>
  );
}
