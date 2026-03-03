"use client";

import React, { useEffect } from "react";
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

  // const columns: ColumnDef<User>[] = [
  //   {
  //     accessorKey: "id",
  //     header: "ID",
  //   },
  //   {
  //     accessorKey: "name",
  //     header: "Name",
  //   },
  //   {
  //     accessorKey: "email",
  //     header: "Email",
  //   },
  //   {
  //     id: "actions",
  //     header: "Actions",
  //     cell: ({ row }) => {
  //       const user = row.original;
  //       return (
  //         <div className="flex gap-2">
  //           <Button size="sm" onClick={() => router.push(`/users/${user.id}`)}>
  //             <Edit size={14} />
  //           </Button>
  //           <Button
  //             size="sm"
  //             variant="destructive"
  //             onClick={()=> handleDelete(user.id)}
  //           >
  //             <Trash2 size={14} />
  //           </Button>
  //         </div>
  //       );
  //     },
  //   },
  // ];
const columns: ColumnDef<User>[] = [
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

  // 🔽 OPTIONAL FIELDS
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
    cell: ({ row }) => { /* unchanged */ },
  },
];

const [columnVisibility, setColumnVisibility] =
  React.useState<VisibilityState>({
    role: false,
    createdAt: false,
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">User Management</h1>
        <Button onClick={() => router.push("/users/create")}>
          <Plus size={16} /> Create User
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={users} />
      )}
    </div>
  );
}
