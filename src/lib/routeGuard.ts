import { sidebarMenu } from "@/constants/sidebarMenu";
import type { Role } from "@/constants/sidebarMenu";

const AUTH_PATHS = ["/auth/login", "/auth/register"] as const;

/**
 * Paths that don't require the main app shell (navbar/sidebar).
 * Auth pages use a minimal layout.
 */
export function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/**
 * All path prefixes that a role is allowed to access, derived from sidebar menu (including nested).
 */
export function getAllowedPathsForRole(role: Role): string[] {
  const paths: string[] = [];
  for (const menu of sidebarMenu) {
    if (menu.roles.includes(role)) {
      if (menu.href) paths.push(menu.href);
    }
    for (const child of menu.children ?? []) {
      if (!child.roles.includes(role)) continue;
      if (child.href) paths.push(child.href);
      for (const sub of child.children ?? []) {
        if (sub.roles.includes(role) && sub.href) paths.push(sub.href);
      }
    }
  }
  return paths;
}

/**
 * Whether the current pathname is allowed for the given role.
 * Allows exact match or any path under an allowed prefix (e.g. /users/123 under /users).
 */
export function isPathAllowedForRole(pathname: string, role: Role): boolean {
  if (pathname === "/") return true;
  const allowed = getAllowedPathsForRole(role);
  return allowed.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}
