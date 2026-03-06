import { Home, Users, Info } from "lucide-react";

export type Role = "admin" | "manager" | "guest";

export interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ size?: number }>;
  roles: Role[];
  children?: MenuItem[];
}

/**
 * Sidebar menu matches app folder structure. Role-based access:
 * - admin: dashboard (all), management, users, about (all)
 * - manager: dashboard, about (and their subpages)
 * - guest: dashboard only (and its subpages)
 */
export const sidebarMenu: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "manager", "guest"],
    children: [
      { label: "Analytics", href: "/dashboard/analytics", roles: ["admin", "manager", "guest"] },
      { label: "Metrics", href: "/dashboard/metrics", roles: ["admin", "manager", "guest"] },
      { label: "Reports", href: "/dashboard/reports", roles: ["admin", "manager", "guest"] },
      {
        label: "Management",
        roles: ["admin"],
        children: [
          { label: "Config", href: "/dashboard/management/config", roles: ["admin"] },
          { label: "Maintenance", href: "/dashboard/management/maintenance", roles: ["admin"] },
          { label: "Settings", href: "/dashboard/management/settings", roles: ["admin"] },
        ],
      },
    ],
  },
  {
    label: "Users",
    icon: Users,
    href: "/users",
    roles: ["admin"],
    children: [
      { label: "Create User", href: "/users/create", roles: ["admin"] },
      { label: "Import Users", href: "/users/import", roles: ["admin"] },
      { label: "Active Users", href: "/users/active", roles: ["admin"] },
      { label: "Inactive Users", href: "/users/inactive", roles: ["admin"] },
      { label: "Roles", href: "/users/roles", roles: ["admin"] },
    ],
  },
  {
    label: "About",
    icon: Info,
    href: "/about",
    roles: ["admin", "manager"],
    children: [
      { label: "Mission", href: "/about/mission", roles: ["admin", "manager"] },
      { label: "Vision", href: "/about/vision", roles: ["admin", "manager"] },
      {
        label: "Resources",
        roles: ["admin", "manager"],
        children: [
          { label: "Contact", href: "/about/resources/contact", roles: ["admin", "manager"] },
          { label: "Docs", href: "/about/resources/docs", roles: ["admin", "manager"] },
          { label: "Help", href: "/about/resources/help", roles: ["admin", "manager"] },
        ],
      },
    ],
  },
];
