// src/lib/permissionApi.ts
import { UserRole } from "@/types/User";
import type { RoleGroup, AllPermissionsView, GroupPermissionsDetail } from "@/types/Permission";

const baseUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchAllGroups(): Promise<RoleGroup[]> {
  const res = await fetch(`${baseUrl()}/permissions/groups`, { headers: authHeaders() });
  return handleResponse<RoleGroup[]>(res);
}

export async function createGroup(name: string, roles: UserRole[]): Promise<RoleGroup> {
  const res = await fetch(`${baseUrl()}/permissions/groups`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, roles }),
  });
  return handleResponse<RoleGroup>(res);
}

export async function deleteGroup(id: number): Promise<void> {
  const res = await fetch(`${baseUrl()}/permissions/groups/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete group");
}

export async function fetchAllPermissions(): Promise<AllPermissionsView> {
  const res = await fetch(`${baseUrl()}/permissions`, { headers: authHeaders() });
  return handleResponse<AllPermissionsView>(res);
}

export async function fetchGroupPermissions(groupId: number): Promise<GroupPermissionsDetail> {
  const res = await fetch(`${baseUrl()}/permissions/group/${groupId}`, { headers: authHeaders() });
  return handleResponse<GroupPermissionsDetail>(res);
}

export async function setGroupPermissions(groupId: number, menuItemIds: number[]): Promise<void> {
  const res = await fetch(`${baseUrl()}/permissions/group/${groupId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ menuItemIds }),
  });
  if (!res.ok) throw new Error("Failed to save permissions");
}