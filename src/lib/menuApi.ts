// //src/lib/menuApi.ts

// // Fetches role-based menu from backend and maps to frontend MenuItem shape.
// import type { MenuItem } from "@/hooks/useMenu";

// /** Backend menu item shape (GET /menu/:role) */
// interface BackendMenuItem {
//   id: number;
//   parentId?: number;
//   label: string;
//   href?: string;
//   icon?: string;
//   roles?: string[];
//   children: BackendMenuItem[];
// }

// function mapBackendToFrontend(item: BackendMenuItem): MenuItem {
//   return {
//     label: item.label,
//     href: item.href,
//     icon: item.icon,
//     children:
//       item.children?.length > 0
//         ? item.children.map(mapBackendToFrontend)
//         : undefined,
//   };
// }

// /**
//  * Fetches menu tree for the given role from backend and returns it in frontend MenuItem shape.
//  * Used after login/register for role-based sidebar and routing.
//  */
// export async function fetchMenuByRole(role: string): Promise<MenuItem[]> {
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
//   const res = await fetch(`${baseUrl}/menu/${encodeURIComponent(role)}`);
//   if (!res.ok) {
//     throw new Error("Failed to fetch menu");
//   }
//   const data: BackendMenuItem[] = await res.json();
//   return (data || []).map(mapBackendToFrontend);
// }




// src/lib/menuApi.ts
// Fetches role-based menu from backend and maps to frontend MenuItem shape.
import type { MenuItem } from "@/hooks/useMenu";

/** Backend menu item shape (GET /menu/:role) */
interface BackendMenuItem {
  id: number;
  parentId?: number;
  label: string;
  href?: string;
  icon?: string;
  roles?: string[];
  children: BackendMenuItem[];
}

function mapBackendToFrontend(item: BackendMenuItem): MenuItem {
  return {
    label: item.label,
    href: item.href,
    icon: item.icon,
    children:
      item.children?.length > 0
        ? item.children.map(mapBackendToFrontend)
        : undefined,
  };
}

/**
 * Fetches menu tree for the given role from backend and returns it in frontend MenuItem shape.
 * Used after login/register for role-based sidebar and routing.
 */
export async function fetchMenuByRole(role: string): Promise<MenuItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${baseUrl}/menu/${encodeURIComponent(role)}`);
  if (!res.ok) {
    throw new Error("Failed to fetch menu");
  }
  const data: BackendMenuItem[] = await res.json();
  return (data || []).map(mapBackendToFrontend);
}