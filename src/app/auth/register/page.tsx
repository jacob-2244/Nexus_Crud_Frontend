"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/User";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!name || !email) {
      setMessage("Name and email are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });

      if (!res.ok) {
        const error = await res.json();
        setMessage(error.message || "Registration failed");
        setLoading(false);
        return;
      }

      const user = await res.json();
      login(user); // save in context/localStorage

      // Redirect based on role
      if (user.role === "admin") router.push("/dashboard");
      else if (user.role === "user") router.push("/dashboard");
      else router.push("/dashboard"); // guest also goes to dashboard

    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
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
        <option value={UserRole.ADMIN}>Admin</option>
        <option value={UserRole.USER}>User</option>
        <option value={UserRole.GUEST}>Guest</option>
      </select>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleRegister}
        disabled={loading}
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