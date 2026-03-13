// src/lib/routeGuard.ts
import { MenuItem } from "@/hooks/useMenu";

const AUTH_PATHS = ["/auth/login", "/auth/register", "/auth/superadmin"] as const;

export function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function getAllowedPaths(menu: MenuItem[]): string[] {
  const paths: string[] = [];
  const traverse = (items: MenuItem[]) => {
    items.forEach((item) => {
      if (item.href) paths.push(item.href);
      if (item.children) traverse(item.children);
    });
  };
  traverse(menu);
  return paths;
}

export function isPathAllowed(pathname: string, menu: MenuItem[]): boolean {
  const allowedPaths = getAllowedPaths(menu);
  return allowedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}