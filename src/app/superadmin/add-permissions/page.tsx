// src/app/superadmin/add-permissions/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAllGroups, fetchGroupPermissions, setGroupPermissions } from "@/lib/permissionApi";
import type { RoleGroup, MenuItemFlat } from "@/types/Permission";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Save, Shield } from "lucide-react";

// ── Tree types ────────────────────────────────────────────────────────────────

interface TreeNode extends MenuItemFlat {
  granted: boolean;
  children: TreeNode[];
}

function buildTree(items: (MenuItemFlat & { granted: boolean })[]) : TreeNode[] {
  const map = new Map<number, TreeNode>();
  items.forEach((item) => map.set(item.id, { ...item, children: [] }));

  const roots: TreeNode[] = [];
  map.forEach((node) => {
    if (node.parentId) {
      const parent = map.get(node.parentId);
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function collectIds(node: TreeNode): number[] {
  return [node.id, ...node.children.flatMap(collectIds)];
}

// ── Checkbox node ─────────────────────────────────────────────────────────────

function CheckboxNode({
  node,
  checkedIds,
  onToggle,
  depth = 0,
}: {
  node: TreeNode;
  checkedIds: Set<number>;
  onToggle: (ids: number[], checked: boolean) => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;
  const allChildIds = hasChildren ? collectIds(node).slice(1) : [];
  const selfChecked = checkedIds.has(node.id);
  const childCheckedCount = allChildIds.filter((id) => checkedIds.has(id)).length;
  const indeterminate = hasChildren && childCheckedCount > 0 && childCheckedCount < allChildIds.length;
  const allChecked = hasChildren
    ? selfChecked && allChildIds.every((id) => checkedIds.has(id))
    : selfChecked;

  return (
    <div className={depth > 0 ? "ml-5 border-l border-gray-200 dark:border-gray-600 pl-3" : ""}>
      <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
        {hasChildren ? (
          <button type="button" onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-600 shrink-0">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-[14px] shrink-0" />
        )}

        <input
          type="checkbox"
          id={`menu-${node.id}`}
          checked={allChecked}
          ref={(el) => { if (el) el.indeterminate = indeterminate; }}
          onChange={(e) => onToggle(collectIds(node), e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer"
        />

        <label htmlFor={`menu-${node.id}`} className="flex-1 flex items-center gap-2 cursor-pointer min-w-0">
          <span className={`font-medium text-sm ${depth === 0 ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
            {node.label}
          </span>
          {node.href && (
            <span className="text-xs text-gray-400 truncate hidden sm:block">{node.href}</span>
          )}
        </label>

        {hasChildren && (
          <span className="text-xs text-gray-400 shrink-0">
            {childCheckedCount}/{allChildIds.length}
          </span>
        )}
      </div>

      {hasChildren && open && (
        <div>
          {node.children.map((child) => (
            <CheckboxNode
              key={child.id}
              node={child}
              checkedIds={checkedIds}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const SUPERADMIN_LABELS = ["Super Admin", "View Permissions", "Add Group", "Add Permissions"];

export default function AddPermissionsPage() {
  const [groups, setGroups] = useState<RoleGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [allMenuItems, setAllMenuItems] = useState<(MenuItemFlat & { granted: boolean })[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  // Load groups once
  useEffect(() => {
    fetchAllGroups()
      .then(setGroups)
      .catch((err) => setMessage({ text: err.message, error: true }))
      .finally(() => setLoadingGroups(false));
  }, []);

  const showMessage = (text: string, error = false) => {
    setMessage({ text, error });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleGroupSelect = (id: number) => {
    if (id === selectedGroupId) return; // avoid re-fetching same group
    setSelectedGroupId(id);
    setLoadingPerms(true);
    setAllMenuItems([]);
    setCheckedIds(new Set());

    fetchGroupPermissions(id)
      .then((detail) => {
        // Filter out superadmin-only items from the tree
        const visible = detail.menuItems.filter(
          (m) => !SUPERADMIN_LABELS.includes(m.label)
        );
        setAllMenuItems(visible);
        setCheckedIds(new Set(visible.filter((m) => m.granted).map((m) => m.id)));
      })
      .catch((err) => showMessage(err.message, true))
      .finally(() => setLoadingPerms(false));
  };

  const handleToggle = useCallback((ids: number[], checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  }, []);

  const handleSave = async () => {
    if (!selectedGroupId) return;
    setSaving(true);
    try {
      await setGroupPermissions(selectedGroupId, Array.from(checkedIds));
      showMessage("Permissions saved successfully!");
    } catch (err: any) {
      showMessage(err.message || "Failed to save", true);
    } finally {
      setSaving(false);
    }
  };

  const tree = buildTree(allMenuItems);
  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Permissions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Select a group, then check which pages they can access. Changes take effect on next login.
        </p>
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm border ${
          message.error
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-green-50 text-green-700 border-green-200"
        }`}>
          {message.error ? "" : "✓ "}{message.text}
        </div>
      )}

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Group selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-fit">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
            <Shield size={16} className="text-indigo-500" />
            <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-200">Select Group</h2>
          </div>

          {loadingGroups ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
            </div>
          ) : groups.length === 0 ? (
            <div className="p-4 text-sm text-gray-400 text-center">No groups yet. Create one first.</div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {groups.map((group) => (
                <li key={group.id}>
                  <button
                    type="button"
                    onClick={() => handleGroupSelect(group.id)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      selectedGroupId === group.id
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <span className="block font-medium">{group.name}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">{group.roles.join(", ")}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Permission tree */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {!selectedGroupId ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Shield size={40} className="opacity-30" />
              <p className="text-sm">Select a group to manage its page access</p>
            </div>
          ) : loadingPerms ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">{selectedGroup?.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{checkedIds.size} pages selected</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline" size="sm" className="text-xs"
                    onClick={() => setCheckedIds(new Set(allMenuItems.map((m) => m.id)))}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline" size="sm" className="text-xs"
                    onClick={() => setCheckedIds(new Set())}
                  >
                    None
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5">
                    <Save size={14} />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-1">
                {tree.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No menu items found</p>
                ) : (
                  tree.map((node) => (
                    <CheckboxNode
                      key={node.id}
                      node={node}
                      checkedIds={checkedIds}
                      onToggle={handleToggle}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}