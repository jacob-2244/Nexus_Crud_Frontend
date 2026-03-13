// src/app/superadmin/add-group/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchAllGroups, createGroup, deleteGroup } from "@/lib/permissionApi";
import { UserRole } from "@/types/User";
import type { RoleGroup } from "@/types/Permission";
import { Trash2, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ALL_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.GUEST];

const ROLE_COLORS: Record<string, string> = {
  admin:   "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  guest:   "bg-gray-100 text-gray-600",
};

export default function AddGroupPage() {
  const [groups, setGroups] = useState<RoleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  // Load once on mount
  useEffect(() => {
    fetchAllGroups()
      .then(setGroups)
      .catch((err) => setMessage({ text: err.message, error: true }))
      .finally(() => setLoading(false));
  }, []);

  const showMessage = (text: string, error = false) => {
    setMessage({ text, error });
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleRole = (role: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedRoles.length === 0) return;
    setSaving(true);
    try {
      const newGroup = await createGroup(groupName.trim(), selectedRoles);
      setGroups((prev) => [...prev, newGroup]);
      setGroupName("");
      setSelectedRoles([]);
      showMessage(`Group "${newGroup.name}" created successfully!`);
    } catch (err: any) {
      showMessage(err.message || "Failed to create group", true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete group "${name}"? Its permissions will also be removed.`)) return;
    try {
      await deleteGroup(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      showMessage("Group deleted");
    } catch (err: any) {
      showMessage(err.message || "Failed to delete group", true);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Group</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create permission groups by combining roles. Then assign page access from the Add Permissions page.
        </p>
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm border ${
          message.error
            ? "bg-red-50 dark:bg-red-900/20 text-red-700 border-red-200"
            : "bg-green-50 dark:bg-green-900/20 text-green-700 border-green-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Create form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Create New Group</h2>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Group Name</label>
          <Input
            placeholder="e.g. Viewers, Editors, All Staff"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="max-w-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Roles</label>
          <div className="flex flex-wrap gap-3">
            {ALL_ROLES.map((role) => {
              const selected = selectedRoles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    selected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300"
                  }`}
                >
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                    selected ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                  }`}>
                    {selected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          onClick={handleCreate}
          disabled={saving || !groupName.trim() || selectedRoles.length === 0}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          {saving ? "Creating..." : "Create Group"}
        </Button>
      </div>

      {/* Existing groups */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <Users size={18} className="text-gray-500" />
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Existing Groups ({groups.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : groups.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">
            No groups yet. Create your first group above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {groups.map((group) => (
              <li key={group.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{group.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {group.roles.map((role) => (
                      <span key={role} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role] ?? ROLE_COLORS.guest}`}>
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(group.id, group.name)}
                  className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}