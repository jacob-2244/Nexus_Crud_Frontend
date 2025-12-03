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

  const { users, loading, error } = useSelector((state: RootState) => state.user);

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
    if (!confirm("Are you sure you want to delete this user?")) return;
    dispatch(deleteUser(id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button className="flex items-center gap-2" onClick={handleCreate}>
          <Plus size={16} /> Create User
        </Button>
      </div>

      {/* Loading / Error */}
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}

      {/* Table */}
      {!loading && users.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-center border-gray-200 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-black py-3 px-4 border-b">ID</th>
                  <th className="text-black py-3 px-4 border-b">Name</th>
                  <th className="text-black py-3 px-4 border-b">Email</th>
                  <th className="text-black py-3 px-4 border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} >
                    <td className="py-3 px-4 border-b">{user.id}</td>
                    <td className="py-3 px-4 border-b">{user.name}</td>
                    <td className="py-3 px-4 border-b">{user.email}</td>
                    <td className="py-3 px-4 border-b flex justify-center gap-2">
                      <Button size="sm" onClick={() => handleEdit(user.id)} className="flex gap-1 hover:cursor-pointer">
                        <Edit size={14} /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex gap-1 hover:cursor-pointer"
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

          {/* Pagination + Rows Per Page */}
          <div className="mt-6 flex items-center justify-between">
            <Pagination>
              <PaginationContent>
                {/* Prev */}
                <PaginationItem>
                  <PaginationPrevious
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

           
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rows per page:</span>
              <Select
                value={usersPerPage.toString()}
                onValueChange={(val) => {
                  setUsersPerPage(Number(val));
                  setCurrentPage(1); 
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[5, 10, 15, 20].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
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
