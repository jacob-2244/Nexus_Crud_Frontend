import { Home, Users, Settings, BarChart, Info } from "lucide-react";

export type Role = "admin" | "user" | "guest";

export interface MenuItem {
  label: string;
  href?: string;
  icon?: any;
  roles: Role[];
  children?: MenuItem[];
}

export const sidebarMenu: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "user", "guest"],
    children: [
      {
        label: "Analytics",
        href: "/dashboard/analytics",
        roles: ["admin", "user"],
      },
    ],
  },

  {
    label: "Management",
    icon: Settings,
    roles: ["admin"],
    children: [
      {
        label: "Config",
        href: "/dashboard/management/config",
        roles: ["admin"],
      },
      {
        label: "Maintenance",
        href: "/dashboard/management/maintenance",
        roles: ["admin"],
      },
      {
        label: "Settings",
        href: "/dashboard/management/settings",
        roles: ["admin"],
      },
    ],
  },

  {
    label: "Users",
    icon: Users,
    href: "/users",
    roles: ["admin", "user"],
    children: [
      { label: "Create User", href: "/users/create", roles: ["admin"] },
      { label: "Import Users", href: "/users/import", roles: ["admin"] },
      { label: "Active Users", href: "/users/active", roles: ["admin", "user"] },
      { label: "Inactive Users", href: "/users/inactive", roles: ["admin"] },
    ],
  },

  {
    label: "About",
    icon: Info,
    href: "/about",
    roles: ["admin", "user", "guest"],
    children: [
      { label: "Mission", href: "/about/mission", roles: ["admin", "user", "guest"] },
      { label: "Vision", href: "/about/vision", roles: ["admin", "user", "guest"] },
      { label: "Resources", href: "/about/resources", roles: ["admin", "user", "guest"] },
      { label: "Contact", href: "/about/contact", roles: ["admin", "user", "guest"] },
      { label: "Docs", href: "/about/docs", roles: ["admin", "user", "guest"] },
      { label: "Help", href: "/about/help", roles: ["admin", "user", "guest"] },
    ],
  },
];