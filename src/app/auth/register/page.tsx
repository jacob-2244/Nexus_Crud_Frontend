// // src/app/auth/register/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/AuthContext";
// import { UserRole } from "@/types/User";

// export default function RegisterPage() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState<UserRole>(UserRole.MANAGER);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const router = useRouter();
//   const { login } = useAuth();

//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

//   const handleRegister = async () => {
//     if (!name || !email) {
//       setMessage("Name and email are required");
//       return;
//     }

//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch(`${apiUrl}/users`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, role }),
//       });

//       if (!res.ok) {
//         const error = await res.json().catch(() => ({}));
//         setMessage(error.message || "Registration failed");
//         setLoading(false);
//         return;
//       }

//       const user = await res.json();
//       login(user); // save in context/localStorage

//       router.push("/dashboard");

//     } catch (err) {
//       console.error(err);
//       setMessage(
//         err instanceof TypeError && (err as Error).message === "Failed to fetch"
//           ? "Cannot reach server. Make sure the backend is running on " + apiUrl
//           : "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100 dark:bg-gray-900 p-4">
//       <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Register</h1>
//       <input
//         className="p-2 border rounded w-64"
//         type="text"
//         placeholder="Enter name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <input
//         className="p-2 border rounded w-64"
//         type="email"
//         placeholder="Enter email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <select
//         className="p-2 border rounded w-64"
//         value={role}
//         onChange={(e) => setRole(e.target.value as UserRole)}
//       >
//         <option value={UserRole.ADMIN}>Admin</option>
//         <option value={UserRole.MANAGER}>Manager</option>
//         <option value={UserRole.GUEST}>Guest</option>
//       </select>
//       <button
//         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//         onClick={handleRegister}
//         disabled={loading}
//       >
//         {loading ? "Registering..." : "Register"}
//       </button>

//       <p className="text-gray-700 dark:text-gray-300">
//         Already have an account?{" "}
//         <span
//           className="text-blue-600 cursor-pointer"
//           onClick={() => router.push("/auth/login")}
//         >
//           Login
//         </span>
//       </p>

//       {message && <p className="text-red-500">{message}</p>}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, User } from "@/types/User";
import { MenuItem } from "@/hooks/useMenu";

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

  // -------------------- helper --------------------
  const generateMenuFromPermissions = (permissions: string[]): MenuItem[] => {
    const menuMap: Record<string, MenuItem> = {
      "/dashboard": { label: "Dashboard", href: "/dashboard", children: [] },
      "/dashboard/analytics": { label: "Analytics", href: "/dashboard/analytics" },
      "/dashboard/metrics": { label: "Metrics", href: "/dashboard/metrics" },
      "/dashboard/reports": { label: "Reports", href: "/dashboard/reports" },
      "/dashboard/management/config": { label: "Config", href: "/dashboard/management/config" },
      "/dashboard/management/maintenance": { label: "Maintenance", href: "/dashboard/management/maintenance" },
      "/dashboard/management/settings": { label: "Settings", href: "/dashboard/management/settings" },
      "/users": { label: "Users", href: "/users", children: [] },
      "/users/create": { label: "Create User", href: "/users/create" },
      "/users/import": { label: "Import User", href: "/users/import" },
      "/users/active": { label: "Active Users", href: "/users/active" },
      "/users/inactive": { label: "Inactive Users", href: "/users/inactive" },
      "/users/roles": { label: "Roles", href: "/users/roles" },
      "/about": { label: "About", href: "/about", children: [] },
      "/about/mission": { label: "Mission", href: "/about/mission" },
      "/about/vision": { label: "Vision", href: "/about/vision" },
      "/about/resources/contact": { label: "Contact", href: "/about/resources/contact" },
      "/about/resources/docs": { label: "Docs", href: "/about/resources/docs" },
      "/about/resources/help": { label: "Help", href: "/about/resources/help" },
    };

    const menuItems: MenuItem[] = [];

    permissions.forEach((p) => {
      const menuItem = menuMap[p];
      if (!menuItem) return;

      if (p.startsWith("/dashboard")) {
        let parent = menuItems.find((m) => m.label === "Dashboard");
        if (!parent) {
          parent = { ...menuMap["/dashboard"], children: [] };
          menuItems.push(parent);
        }
        if (p !== "/dashboard") parent.children?.push(menuItem);
      }

      if (p.startsWith("/users")) {
        let parent = menuItems.find((m) => m.label === "Users");
        if (!parent) {
          parent = { ...menuMap["/users"], children: [] };
          menuItems.push(parent);
        }
        if (p !== "/users") parent.children?.push(menuItem);
      }

      if (p.startsWith("/about")) {
        let parent = menuItems.find((m) => m.label === "About");
        if (!parent) {
          parent = { ...menuMap["/about"], children: [] };
          menuItems.push(parent);
        }
        if (p !== "/about") parent.children?.push(menuItem);
      }
    });

    return menuItems;
  };
  // -------------------- end helper --------------------

  // fetch roles dynamically
  useEffect(() => {
    fetch(`${apiUrl}/users/roles`)
      .then((res) => res.json())
      .then((data: UserRole[]) => {
        setRoles(data);
        if (data.includes(UserRole.MANAGER)) setRole(UserRole.MANAGER);
        else setRole(data[0] || "");
      })
      .catch(() => setRoles([UserRole.MANAGER]));
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

      const data: { user: User; permissions: string[] } = await res.json();
      const menu = generateMenuFromPermissions(data.permissions);
      login(data.user, menu); // save user & menu in context/localStorage

      const firstPath = menu?.[0]?.href || "/dashboard";
      router.replace(firstPath);
    } catch (err) {
      console.error(err);
      setMessage(
        err instanceof TypeError && err.message === "Failed to fetch"
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