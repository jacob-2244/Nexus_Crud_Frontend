



// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import { createUser } from "@/redux/slices/userSlice";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/AuthContext";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormDescription,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { UserRole } from "@/types/User";

// const createSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   role: z.nativeEnum(UserRole).optional(),
// });
// type CreateFormValues = z.infer<typeof createSchema>;

// export default function CreateUserPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { login } = useAuth();

//   const form = useForm<CreateFormValues>({
//     resolver: zodResolver(createSchema),
//     defaultValues: { name: "", email: "", role: UserRole.USER },
//   });

//   async function onSubmit(values: CreateFormValues) {
//     try {
//       const result = await dispatch(createUser(values)).unwrap();
//       // Automatically log in the newly created user
//       login(result);
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Failed to create user:", error);
//       // Handle error (could show a toast notification)
//     }
//   }

//   return (
//     <div className="p-6 max-w-md mx-auto ">
//       <h1 className="text-2xl font-bold mb-4">Create User</h1>

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="space-y-4 bg-white  p-6 rounded shadow"
//         >
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-black dark:text-white">Name</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="Enter name"
//                     {...field}
//                     className="text-black dark:text-black bg-white dark:bg-white"
//                   />
//                 </FormControl>
//                 <FormDescription className="text-gray-600 dark:text-gray-300">
//                   Minimum 2 characters.
//                 </FormDescription>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-black dark:text-white">Email</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="email@example.com"
//                     {...field}
//                     className="text-black dark:text-black bg-white dark:bg-white"
//                   />
//                 </FormControl>
//                 <FormDescription className="text-gray-600 dark:text-gray-300">
//                   Valid email required.
//                 </FormDescription>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="role"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-black dark:text-white">Role</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger className="text-black dark:text-black bg-white dark:bg-white">
//                       <SelectValue placeholder="Select a role" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
//                     <SelectItem value={UserRole.USER}>User</SelectItem>
//                     <SelectItem value={UserRole.GUEST}>Guest</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormDescription className="text-gray-600 dark:text-gray-300">
//                   Select the user role. Defaults to User.
//                 </FormDescription>
//                 <FormMessage className="text-red-500" />
//               </FormItem>
//             )}
//           />

//           <div className="flex justify-end">
//             <Button
//               type="submit"
//               className="bg-black text-white dark:bg-[var(--edit)] dark:text-white"
//             >
//               Create
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }




"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/User";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.nativeEnum(UserRole).optional(),
});
type CreateFormValues = z.infer<typeof createSchema>;

export default function CreateUserPage() {
  const router = useRouter();
  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", email: "", role: UserRole.USER },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(values: CreateFormValues) {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        setMessage(error.message || "Failed to create user");
        setLoading(false);
        return;
      }

      const user = await res.json();
      console.log("User created:", user);
      setMessage("User created successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormDescription>Minimum 2 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormDescription>Valid email required.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                    <SelectItem value={UserRole.GUEST}>Guest</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select user role.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {message && <p className="text-green-500">{message}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}