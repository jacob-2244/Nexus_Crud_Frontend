"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { sidebarMenu } from "@/constants/sidebarMenu";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role || "guest";

  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  // Auto open active menu
  useEffect(() => {
    sidebarMenu.forEach((menu) => {
      if (menu.children) {
        menu.children.forEach((child) => {
          if (pathname.startsWith(child.href || "")) {
            setOpenMenus((prev) => [...new Set([...prev, menu.label])]);
          }
        });
      }
    });
  }, [pathname]);

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r h-screen overflow-y-auto">
      <div className="p-4 font-bold text-lg border-b">Admin Panel</div>

      <nav className="p-2 space-y-2">
        {sidebarMenu
          .filter((menu) => menu.roles.includes(role))
          .map((menu) => {
            const Icon = menu.icon;
            const isOpen = openMenus.includes(menu.label);
            const hasChildren = menu.children?.length;

            return (
              <div key={menu.label}>
                {/* Parent */}
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800`}
                  onClick={() => hasChildren && toggleMenu(menu.label)}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon size={18} />}
                    {menu.href ? (
                      <Link href={menu.href}>{menu.label}</Link>
                    ) : (
                      <span>{menu.label}</span>
                    )}
                  </div>

                  {hasChildren && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {/* Children */}
                {hasChildren && isOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {menu.children
                      ?.filter((child) => child.roles.includes(role))
                      .map((child) => (
                        <Link
                          key={child.label}
                          href={child.href!}
                          className={`block px-3 py-1 rounded text-sm ${
                            pathname === child.href
                              ? "bg-blue-500 text-white"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
      </nav>
    </aside>
  );
}