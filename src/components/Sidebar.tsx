// //src/components/Sidebar.tsx
// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { ChevronDown, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useMenu, MenuItem } from "@/hooks/useMenu";

// interface SidebarProps {
//   isExpanded?: boolean;
//   setIsExpanded?: (value: boolean) => void;
// }

// export default function Sidebar({ isExpanded = true, setIsExpanded }: SidebarProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { user, logout, isLoading } = useAuth();
//   const role = user?.role || "guest";
//   const { menu: menuItems, loading: menuLoading } = useMenu();

//   const [openMenus, setOpenMenus] = useState<string[]>([]);
//   const [collapsedPopover, setCollapsedPopover] = useState<string | null>(null);

//   const menuKey = (parent: string, label: string) => `${parent}::${label}`;
//   const toggleMenu = (key: string) => {
//     setOpenMenus(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
//   };

//   const handleLogout = () => {
//     logout();
//     router.push("/auth/login");
//   };

//   // Auto-open parent menus based on current route
//   useEffect(() => {
//     const toOpen: string[] = [];
//     const openRecursive = (items: MenuItem[], parentLabel?: string) => {
//       items.forEach(item => {
//         const key = parentLabel ? menuKey(parentLabel, item.label) : item.label;
//         if (item.href && pathname.startsWith(item.href)) {
//           if (parentLabel) toOpen.push(parentLabel);
//           else toOpen.push(item.label);
//         }
//         if (item.children) openRecursive(item.children, item.label);
//       });
//     };
//     openRecursive(menuItems);
//     setOpenMenus(prev => [...new Set([...prev, ...toOpen])]);
//   }, [pathname, menuItems]);

//   const expanded = isExpanded ?? true;
//   const panelTitle = role === "admin" ? "Admin Panel" : role === "manager" ? "Manager Panel" : "Guest Panel";
//   const panelInitials = role === "admin" ? "AP" : role === "manager" ? "MP" : "GP";

//   if (isLoading ||menuLoading) return <aside className="w-64 p-4">Loading menu...</aside>;

// const renderMenu = (items: MenuItem[], parent?: string) => (
//   items.map(item => {
//     const Icon = item.icon ? require("lucide-react")[item.icon] : null;
//     const hasChildren = Array.isArray(item.children) && item.children.length > 0; // ✅ fixed
//     const isOpen = openMenus.includes(item.label) || openMenus.includes(menuKey(parent || "", item.label));

//     if (!expanded) {
//       return (
//         <div key={item.label} className="relative group">
//           {item.href ? (
//             <Link href={item.href} title={item.label} className="flex items-center justify-center p-2.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
//               {Icon && <Icon size={20} />}
//             </Link>
//           ) : (
//             <div title={item.label} onClick={() => setCollapsedPopover(p => (p === item.label ? null : item.label))}
//                  className="flex items-center justify-center p-2.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
//               {Icon && <Icon size={20} />}
//             </div>
//           )}
//         </div>
//       );
//     }

//     return (
//       <div key={item.label}>
//         <div className="flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
//              onClick={() => hasChildren && toggleMenu(item.label)}>
//           <div className="flex items-center gap-2 min-w-0">
//             {Icon && <Icon size={18} />}
//             {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
//           </div>
//           {hasChildren && <ChevronDown size={16} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
//         </div>
//         {hasChildren && isOpen && (
//           <div className="ml-6 mt-1 space-y-1">
//             {renderMenu(item.children ?? [], item.label)} {/* safe fallback */}
//           </div>
//         )}
//       </div>
//     );
//   })
// );

//   return (
//     <aside className={`flex flex-col bg-white dark:bg-gray-900 border-r h-screen shrink-0 transition-[width] duration-200 ${expanded ? "w-64" : "w-16"}`}>
//       {/* Header */}
//       <div className="p-4 font-bold text-lg border-b flex items-center justify-between gap-2 min-h-[3.25rem]">
//         {expanded ? <span className="truncate">{panelTitle}</span> : <span className="text-sm font-bold mx-auto">{panelInitials}</span>}
//       </div>

//       <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
//         {renderMenu(menuItems)}
//       </nav>

//       {/* Collapse/Expand toggle */}
//       {setIsExpanded && (
//         <button type="button" onClick={() => setIsExpanded(!expanded)}
//                 className="p-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800">
//           {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
//         </button>
//       )}

//       {/* Logout */}
//       <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
//         <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 rounded text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
//           <LogOut size={18} />
//           {expanded && <span className="ml-2">Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// }




"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMenu, MenuItem } from "@/hooks/useMenu";

interface SidebarProps {
  isExpanded?: boolean;
  setIsExpanded?: (value: boolean) => void;
}

const PANEL_LABELS: Record<string, { title: string; initials: string }> = {
  superadmin: { title: "Super Admin Panel", initials: "SA" },
  admin:      { title: "Admin Panel",       initials: "AP" },
  manager:    { title: "Manager Panel",     initials: "MP" },
  guest:      { title: "Guest Panel",       initials: "GP" },
};

export default function Sidebar({ isExpanded = true, setIsExpanded }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const role = user?.role || "guest";
  const { menu: menuItems, loading: menuLoading } = useMenu();

  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [collapsedPopover, setCollapsedPopover] = useState<string | null>(null);

  const menuKey = (parent: string, label: string) => `${parent}::${label}`;
  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  // Auto-open parent menus based on current route
  useEffect(() => {
    const toOpen: string[] = [];
    const openRecursive = (items: MenuItem[], parentLabel?: string) => {
      items.forEach((item) => {
        const key = parentLabel
          ? menuKey(parentLabel, item.label)
          : item.label;
        if (item.href && pathname.startsWith(item.href)) {
          if (parentLabel) toOpen.push(parentLabel);
          else toOpen.push(item.label);
        }
        if (item.children) openRecursive(item.children, item.label);
      });
    };
    openRecursive(menuItems);
    setOpenMenus((prev) => [...new Set([...prev, ...toOpen])]);
  }, [pathname, menuItems]);

  const expanded = isExpanded ?? true;
  const panelInfo = PANEL_LABELS[role] ?? PANEL_LABELS.guest;

  if (isLoading || menuLoading)
    return <aside className="w-64 p-4">Loading menu...</aside>;

  const renderMenu = (items: MenuItem[], parent?: string) =>
    items.map((item) => {
      const Icon = item.icon ? require("lucide-react")[item.icon] : null;
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;
      const isOpen =
        openMenus.includes(item.label) ||
        openMenus.includes(menuKey(parent || "", item.label));

      // Active state
      const isActive = item.href
        ? pathname === item.href || pathname.startsWith(item.href + "/")
        : false;

      if (!expanded) {
        return (
          <div key={item.label} className="relative group">
            {item.href ? (
              <Link
                href={item.href}
                title={item.label}
                className={`flex items-center justify-center p-2.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  isActive ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : ""
                }`}
              >
                {Icon && <Icon size={20} />}
              </Link>
            ) : (
              <div
                title={item.label}
                onClick={() =>
                  setCollapsedPopover((p) =>
                    p === item.label ? null : item.label,
                  )
                }
                className="flex items-center justify-center p-2.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                {Icon && <Icon size={20} />}
              </div>
            )}
          </div>
        );
      }

      return (
        <div key={item.label}>
          <div
            className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
              isActive
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                : ""
            }`}
            onClick={() => hasChildren && toggleMenu(item.label)}
          >
            <div className="flex items-center gap-2 min-w-0">
              {Icon && (
                <Icon
                  size={18}
                  className={
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="truncate text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="truncate text-sm">{item.label}</span>
              )}
            </div>
            {hasChildren && (
              <ChevronDown
                size={16}
                className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            )}
          </div>

          {hasChildren && isOpen && (
            <div className="ml-6 mt-1 space-y-0.5">
              {renderMenu(item.children ?? [], item.label)}
            </div>
          )}
        </div>
      );
    });

  return (
    <aside
      className={`flex flex-col bg-white dark:bg-gray-900 border-r h-screen shrink-0 transition-[width] duration-200 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="p-4 font-bold text-lg border-b flex items-center justify-between gap-2 min-h-[3.25rem]">
        {expanded ? (
          <span className="truncate text-base">{panelInfo.title}</span>
        ) : (
          <span className="text-sm font-bold mx-auto">{panelInfo.initials}</span>
        )}
      </div>

      {/* Role badge */}
      {expanded && (
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              role === "superadmin"
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                : role === "admin"
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                : role === "manager"
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            {role}
          </span>
          {user?.name && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {user.name}
            </p>
          )}
        </div>
      )}

      <nav className="p-2 space-y-0.5 flex-1 overflow-y-auto">
        {renderMenu(menuItems)}
      </nav>

      {/* Collapse/Expand toggle */}
      {setIsExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(!expanded)}
          className="p-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      )}

      {/* Logout */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 rounded text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={18} />
          {expanded && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </aside>
  );
}