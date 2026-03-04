"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";

import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers, deleteUser } from "@/redux/slices/userSlice";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
};


 



export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) dispatch(deleteUser(id));
  };

  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // manage columns in state so we can add new ones dynamically
  const [columns, setColumns] = React.useState<ColumnDef<User>[]>([
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    // optional fields
    {
      accessorKey: "role",
      header: "Role",
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }) =>
        getValue()
          ? new Date(getValue() as string).toLocaleDateString()
          : "-",
      enableHiding: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/users/${user.id}`)}
            >
              <Edit size={14} />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(user.id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        );
      },
    },
  ]);

  // helper to add a new column via prompt (could be replaced by modal)
  const addColumn = () => {
    const header = prompt("Column header (display name):");
    if (!header) return;
    const key = prompt(
      "Accessor key (property name in data):",
      header.toLowerCase().replace(/\s+/g, ""),
    );
    if (!key) return;
    const hide = confirm("Start hidden? (OK = yes)");

    setColumns((prev) => [
      ...prev,
      {
        accessorKey: key,
        header,
        enableHiding: true,
      },
    ]);

    if (hide) {
      setColumnVisibility((v) => ({ ...v, [key]: false }));
    }

    // if initial column should be hidden, we can control via DataTable's own visibility
    // we don't have direct access here, but the dropdown will hide it once added.
    // could also store a visibility state and pass down as prop if necessary.
  };

const [columnVisibility, setColumnVisibility] =
  React.useState<VisibilityState>({
    role: false,
    createdAt: false,
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addColumn}>
            + Column
          </Button>
          <Button onClick={() => router.push("/users/create")}> 
            <Plus size={16} /> Create User
          </Button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          initialColumnVisibility={columnVisibility}
        />
      )}
    </div>
  );
}
