"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers, deleteUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const currentUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleCreate = () => router.push("/users/create");
  const handleEdit = (id: number) => router.push(`/users/${id}`);
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return;
    dispatch(deleteUser(id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>

       <Button
          className="flex items-center gap-2 bg-white text-black dark:bg-[var(--edit)] dark:text-white"
          onClick={handleCreate}
        >
          <Plus size={16} /> Create User
        </Button>
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}

      {!loading && users.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-center border-gray-200 rounded">
              <thead className="bg-gray-100 dark:bg-gray-800 ">
                <tr className="">
                  <th className="py-3 px-4 border-b text-black">ID</th>
                  <th className="py-3 px-4 border-b text-black">Name</th>
                  <th className="py-3 px-4 border-b text-black">Email</th>
                  <th className="py-3 px-4 border-b text-black">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 px-4 border-b">{user.id}</td>
                    <td className="py-3 px-4 border-b">{user.name}</td>
                    <td className="py-3 px-4 border-b">{user.email}</td>

                    <td className="py-3 px-4 border-b flex justify-center gap-2">

                      {/* EDIT BUTTON FIXED */}
                      <Button
                        size="sm"
                        onClick={() => handleEdit(user.id)}
                        className="flex gap-1 bg-[var(--edit)] text-[var(--edit-foreground)] hover:opacity-80"
                      >
                        <Edit size={14} /> Edit
                      </Button>

                      {/* DELETE BUTTON */}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex gap-1"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            {/* Rows Per Page */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rows per page:</span>
              <Select
                value={usersPerPage.toString()}
                onValueChange={(v) => {
                  setUsersPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[5, 10, 15, 20].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
