// "use client";

// import { useEffect } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { updateUser, fetchUsers } from "@/redux/slices/userSlice";
// import { useRouter, useParams } from "next/navigation";

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

// const updateSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
// });
// type UpdateFormValues = z.infer<typeof updateSchema>;

// export default function UpdateUserPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { id } = useParams();

//   const { users, loading } = useSelector((state: RootState) => state.user);
//   const user = users.find((u) => u.id === Number(id));

//   const form = useForm<UpdateFormValues>({
//     resolver: zodResolver(updateSchema),
//     defaultValues: { name: user?.name || "", email: user?.email || "" },
//   });

//   useEffect(() => {
//     if (!user) dispatch(fetchUsers());
//     else form.reset({ name: user.name, email: user.email });
//   }, [dispatch, user]);

//   function onSubmit(values: UpdateFormValues) {
//     dispatch(updateUser({ id: Number(id), ...values }));
//     router.push("/users");
//   }

//   if (loading || !user)
//     return <p className="p-6 text-gray-500">Loading user...</p>;

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Update User</h1>

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="space-y-4 bg-white dark:bg-[var(--app-background)] p-6 rounded shadow"
//         >
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter name" {...field} />
//                 </FormControl>
//                 <FormDescription>Minimum 2 characters.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input placeholder="email@example.com" {...field} />
//                 </FormControl>
//                 <FormDescription>Email must be valid.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex justify-end">
//             <Button type="submit">Update</Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }


"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateUser, fetchUsers } from "@/redux/slices/userSlice";
import { useRouter, useParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const updateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
type UpdateFormValues = z.infer<typeof updateSchema>;

export default function UpdateUserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = useParams();

  const { users, loading } = useSelector((state: RootState) => state.user);
  const user = users.find((u) => u.id === Number(id));

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: { name: user?.name || "", email: user?.email || "" },
  });

  useEffect(() => {
    if (!user) dispatch(fetchUsers());
    else form.reset({ name: user.name, email: user.email });
  }, [dispatch, user]);

  function onSubmit(values: UpdateFormValues) {
    dispatch(updateUser({ id: Number(id), ...values }));
    router.push("/users");
  }

  if (loading || !user)
    return <p className="p-6 text-gray-500">Loading user...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 bg-white dark:bg-[var(--app-background)] p-6 rounded shadow"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black dark:text-white">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter name"
                    {...field}
                    className="text-black dark:text-black bg-white dark:bg-white"
                  />
                </FormControl>
                <FormDescription className="text-gray-600 dark:text-gray-300">
                  Minimum 2 characters.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black dark:text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    {...field}
                    className="text-black dark:text-black bg-white dark:bg-white"
                  />
                </FormControl>
                <FormDescription className="text-gray-600 dark:text-gray-300">
                  Email must be valid.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-black text-white dark:bg-[var(--edit)] dark:text-white"
            >
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
