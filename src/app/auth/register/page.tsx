"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, User } from "@/types/User";
import { fetchMenuByRole } from "@/lib/menuApi";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const { login } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetch(`${apiUrl}/users/roles`)
      .then((res) => res.json())
      .then((data: UserRole[]) => {
        const list = Array.isArray(data) && data.length > 0 ? data : Object.values(UserRole);
        setRoles(list);
        setRole((prev) => (prev ? prev : list.includes(UserRole.MANAGER) ? UserRole.MANAGER : list[0]));
      })
      .catch(() => {
        const list = Object.values(UserRole);
        setRoles(list);
        setRole(UserRole.MANAGER);
      });
  }, [apiUrl]);

  const handleRegister = async () => {
    if (!name || !email || !role) {
      setMessage("Name, email, and role are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        setMessage(error.message || "Registration failed");
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Register</h1>
      <input
        className="p-2 border rounded w-64"
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="p-2 border rounded w-64"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select
        className="p-2 border rounded w-64"
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
      >
        <option value="" disabled>
          Select role
        </option>
        {roles.map((r) => (
          <option key={r} value={r}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleRegister}
        disabled={loading || !role}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <p className="text-gray-700 dark:text-gray-300">
        Already have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => router.push("/auth/login")}
        >
          Login
        </span>
      </p>
      {message && <p className="text-red-500">{message}</p>}
    </div>
  );
}
