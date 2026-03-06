"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { sidebarMenu } from "@/constants/sidebarMenu";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isExpanded?: boolean;
  setIsExpanded?: (value: boolean) => void;
}

export default function Sidebar({ isExpanded = true, setIsExpanded }: SidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const role = user?.role || "guest";

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [collapsedPopover, setCollapsedPopover] = useState<string | null>(null);

  const menuKey = (parent: string, label: string) => `${parent}::${label}`;

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Auto-open parent menus when pathname matches a nested route
  useEffect(() => {
    const toOpen: string[] = [];
    sidebarMenu.forEach((menu) => {
      if (!menu.children) return;
      menu.children.forEach((child) => {
        if (child.href && pathname.startsWith(child.href)) {
          toOpen.push(menu.label);
        }
        if (child.children) {
          child.children.forEach((sub) => {
            if (sub.href && pathname.startsWith(sub.href)) {
              toOpen.push(menu.label);
              toOpen.push(menuKey(menu.label, child.label));
            }
          });
        }
      });
    });
    setOpenMenus((prev) => [...new Set([...prev, ...toOpen])]);
  }, [pathname]);

  const expanded = isExpanded ?? true;

  const panelTitle =
    role === "admin" ? "Admin Panel" : role === "manager" ? "Manager Panel" : "Guest Panel";
  const panelInitials =
    role === "admin" ? "AP" : role === "manager" ? "MP" : "GP";

  return (
    <aside
      className={`flex flex-col bg-white dark:bg-gray-900 border-r h-screen shrink-0 transition-[width] duration-200 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {/* Header: title when expanded, initials when collapsed — by role */}
      <div className="p-4 font-bold text-lg border-b shrink-0 flex items-center justify-between gap-2 min-h-[3.25rem]">
        {expanded ? (
          <span className="truncate">{panelTitle}</span>
        ) : (
          <span className="text-sm font-bold mx-auto">{panelInitials}</span>
        )}
      </div>

      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        {sidebarMenu
          .filter((menu) => menu.roles.includes(role))
          .map((menu) => {
            const Icon = menu.icon;
            const isOpen = openMenus.includes(menu.label);
            const hasChildren = menu.children?.length;

            if (!expanded) {
              // Collapsed: icon only, with tooltip; click goes to href or opens first child
              return (
                <div key={menu.label} className="relative group">
                  {menu.href ? (
                    <Link
                      href={menu.href}
                      title={menu.label}
                      className={`flex items-center justify-center p-2.5 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        pathname === menu.href || (menu.href !== "/" && pathname.startsWith(menu.href))
                          ? "bg-blue-500 text-white dark:bg-blue-600"
                          : ""
                      }`}
                    >
                      {Icon && <Icon size={20} />}
                    </Link>
                  ) : (
                    <div
                      title={menu.label}
                      onClick={() => setCollapsedPopover((p) => (p === menu.label ? null : menu.label))}
                      className={`flex items-center justify-center p-2.5 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        collapsedPopover === menu.label ? "bg-gray-100 dark:bg-gray-800" : ""
                      }`}
                    >
                      {Icon && <Icon size={20} />}
                    </div>
                  )}
                  {/* Tooltip when collapsed */}
                  <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                    {menu.label}
                  </span>
                  {/* Flyout when collapsed and menu has children (no href) */}
                  {!menu.href && hasChildren && collapsedPopover === menu.label && (
                    <div
                      className="absolute left-full top-0 ml-1 py-2 min-w-[11rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        {menu.label}
                      </p>
                      {menu.children
                        ?.filter((c) => c.roles.includes(role))
                        .map((child) =>
                          child.children ? (
                            <div key={child.label} className="py-1">
                              <p className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                {child.label}
                              </p>
                              {child.children
                                .filter((sub) => sub.roles.includes(role))
                                .map((sub) => (
                                  <Link
                                    key={sub.label}
                                    href={sub.href!}
                                    className={`block px-4 py-1.5 text-sm ${
                                      pathname === sub.href
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                    onClick={() => setCollapsedPopover(null)}
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                            </div>
                          ) : (
                            <Link
                              key={child.label}
                              href={child.href!}
                              className={`block px-3 py-1.5 text-sm ${
                                pathname === child.href
                                  ? "bg-blue-500 text-white"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                              onClick={() => setCollapsedPopover(null)}
                            >
                              {child.label}
                            </Link>
                          )
                        )}
                    </div>
                  )}
                </div>
              );
            }

            // Expanded: full row with icon + text
            return (
              <div key={menu.label}>
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800`}
                  onClick={() => hasChildren && toggleMenu(menu.label)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {Icon && <Icon size={18} className="shrink-0" />}
                    {menu.href ? (
                      <Link href={menu.href} className="truncate" onClick={(e) => e.stopPropagation()}>
                        {menu.label}
                      </Link>
                    ) : (
                      <span className="truncate">{menu.label}</span>
                    )}
                  </div>

                  {hasChildren && (
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {/* Children (and nested children) - only when expanded */}
                {hasChildren && isOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {menu.children
                      ?.filter((child) => child.roles.includes(role))
                      .map((child) =>
                        child.children ? (
                          <div key={child.label}>
                            <div
                              className="flex items-center justify-between px-3 py-1.5 rounded text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => toggleMenu(menuKey(menu.label, child.label))}
                            >
                              <span className="font-medium">{child.label}</span>
                              <ChevronDown
                                size={14}
                                className={`transition-transform ${
                                  openMenus.includes(menuKey(menu.label, child.label))
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                            {openMenus.includes(menuKey(menu.label, child.label)) && (
                              <div className="ml-3 mt-0.5 space-y-0.5 border-l border-gray-200 dark:border-gray-700 pl-2">
                                {child.children
                                  .filter((sub) => sub.roles.includes(role))
                                  .map((sub) => (
                                    <Link
                                      key={sub.label}
                                      href={sub.href!}
                                      className={`block px-2 py-1 rounded text-sm ${
                                        pathname === sub.href
                                          ? "bg-blue-500 text-white"
                                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                      }`}
                                    >
                                      {sub.label}
                                    </Link>
                                  ))}
                              </div>
                            )}
                          </div>
                        ) : (
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
                        )
                      )}
                  </div>
                )}
              </div>
            );
          })}
      </nav>

      {/* Collapse/Expand toggle */}
      {setIsExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(!expanded)}
          className="p-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? (
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
          )}
        </button>
      )}

      {/* Logout */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          className={`flex items-center w-full px-3 py-2 rounded text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
            expanded ? "gap-2" : "justify-center"
          }`}
          title="Logout"
        >
          <LogOut size={18} className="shrink-0" />
          {expanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}