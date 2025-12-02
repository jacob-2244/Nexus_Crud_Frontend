// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { fetchUsers, deleteUser } from "@/redux/slices/userSlice";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Plus, Edit, Trash2 } from "lucide-react";


// export default function UsersPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { users, loading, error } = useSelector((state: RootState) => state.user);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const handleCreate = () => router.push("/users/create");
//   const handleEdit = (id: number) => router.push(`/users/${id}`);
//   const handleDelete = (id: number) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;
//     dispatch(deleteUser(id));
//   };

//   return (
//     <>

//       <div className="p-6 max-w-5xl mx-auto w-full">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">User Management</h1>
//           <Button
//             className="hover:cursor-pointer hover:bg-gray-700 flex items-center gap-2"
//             onClick={handleCreate}
//           >
//             <Plus size={16} /> Create User
//           </Button>
//         </div>

//         {loading && <p className="text-gray-500">Loading users...</p>}
//         {error && <p className="text-red-500">{error}</p>}
//         {!loading && users.length === 0 && <p className="text-gray-500">No users found.</p>}

//         {!loading && users.length > 0 && (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border text-center border-gray-200 rounded">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="py-3 px-4 border-b">ID</th>
//                   <th className="py-3 px-4 border-b">Name</th>
//                   <th className="py-3 px-4 border-b">Email</th>
//                   <th className="py-3 px-4 border-b">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="py-3 px-4 border-b">{user.id}</td>
//                     <td className="py-3 px-4 border-b">{user.name}</td>
//                     <td className="py-3 px-4 border-b">{user.email}</td>
//                     <td className="py-3 px-4 border-b space-x-2 flex  justify-center">
//                       <Button
//                         className="hover:cursor-pointer hover:bg-gray-700 flex items-center gap-1"
//                         size="sm"
//                         onClick={() => handleEdit(user.id)}
//                       >
//                         <Edit size={14} /> Edit
//                       </Button>
//                       <Button
//                         className="hover:cursor-pointer hover:bg-red-500 flex items-center gap-1"
//                         size="sm"
//                         variant="destructive"
//                         onClick={() => handleDelete(user.id)}
//                       >
//                         <Trash2 size={14} /> Delete
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }




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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // ⭐ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const { users, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // ⭐ PAGINATION LOGIC
  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);

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
                  <th className="py-3 px-4 border-b">ID</th>
                  <th className="py-3 px-4 border-b">Name</th>
                  <th className="py-3 px-4 border-b">Email</th>
                  <th className="py-3 px-4 border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{user.id}</td>
                    <td className="py-3 px-4 border-b">{user.name}</td>
                    <td className="py-3 px-4 border-b">{user.email}</td>
                    <td className="py-3 px-4 border-b flex justify-center gap-2">
                      <Button size="sm" onClick={() => handleEdit(user.id)} className="flex gap-1">
                        <Edit size={14} /> Edit
                      </Button>
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

        
          <div className="mt-6 flex justify-center">
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
          </div>
        </>
      )}
    </div>
  );
}
