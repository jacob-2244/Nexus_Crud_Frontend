// src/app/superadmin/view-permissions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchAllPermissions } from "@/lib/permissionApi";
import type { AllPermissionsView, MenuItemFlat } from "@/types/Permission";

function buildPath(item: MenuItemFlat, allItems: MenuItemFlat[]): string {
  const parts: string[] = [item.label];
  let current = item;
  let safety = 0;
  while (current.parentId && safety < 10) {
    const parent = allItems.find((i) => i.id === current.parentId);
    if (!parent) break;
    parts.unshift(parent.label);
    current = parent;
    safety++;
  }
  return parts.join(" › ");
}

const SUPERADMIN_LABELS = ["Super Admin", "View Permissions", "Add Group", "Add Permissions"];

const ROLE_COLORS: Record<string, string> = {
  admin:   "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  guest:   "bg-gray-100 text-gray-600",
};

export default function ViewPermissionsPage() {
  const [data, setData] = useState<AllPermissionsView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchAllPermissions()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load permissions");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []); // empty deps — runs once only

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-3 min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        <p className="text-sm text-gray-500">Loading permissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 rounded-lg p-4 border border-red-200">
          ⚠ {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const visibleMenuItems = data.menuItems.filter(
    (item) => !SUPERADMIN_LABELS.includes(item.label)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">View Permissions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Which groups can access which pages.
        </p>
      </div>

      {data.groups.length === 0 ? (
        <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4 border border-yellow-200">
          No groups found. Go to <strong>Add Group</strong> to create your first group.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.groups.map((group) => {
            const granted = visibleMenuItems.filter((item) =>
              group.grantedMenuItemIds.includes(item.id)
            );
            const denied = visibleMenuItems.filter(
              (item) => !group.grantedMenuItemIds.includes(item.id)
            );

            return (
              <div
                key={group.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="bg-indigo-50 dark:bg-indigo-900/30 px-5 py-4 border-b border-indigo-100 dark:border-indigo-800">
                  <h2 className="font-semibold text-indigo-900 dark:text-indigo-200 text-lg">
                    {group.name}
                  </h2>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {group.roles.map((role) => (
                      <span
                        key={role}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role] ?? ROLE_COLORS.guest}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="px-5 py-2 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex gap-4 text-xs">
                  <span className="text-green-600 font-medium">✓ {granted.length} accessible</span>
                  <span className="text-red-500 font-medium">✗ {denied.length} blocked</span>
                </div>

                {/* Granted */}
                <div className="px-5 py-3 flex-1 overflow-y-auto max-h-60">
                  {granted.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No pages accessible</p>
                  ) : (
                    <ul className="space-y-1">
                      {granted.map((item) => (
                        <li key={item.id} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                          <div>
                            <span className="block">{buildPath(item, visibleMenuItems)}</span>
                            {item.href && <span className="text-xs text-gray-400">{item.href}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Denied */}
                {denied.length > 0 && (
                  <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 max-h-36 overflow-y-auto">
                    <p className="text-xs font-semibold text-red-500 mb-1.5">Blocked pages</p>
                    <ul className="space-y-1">
                      {denied.map((item) => (
                        <li key={item.id} className="text-xs text-gray-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                          {buildPath(item, visibleMenuItems)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}