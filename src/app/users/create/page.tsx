// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import { createUser } from "@/redux/slices/userSlice";
// import { useRouter } from "next/navigation";

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

// const createSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
// });
// type CreateFormValues = z.infer<typeof createSchema>;

// export default function CreateUserPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();

//   const form = useForm<CreateFormValues>({
//     resolver: zodResolver(createSchema),
//     defaultValues: { name: "", email: "" },
//   });

//   function onSubmit(values: CreateFormValues) {
//     dispatch(createUser(values));
//     router.push("/users");
//   }

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Create User</h1>

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="space-y-4 bg-white  dark:bg-[var(--app-background)] p-6 rounded shadow"
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
//                 <FormDescription>Valid email required.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex justify-end">
//             <Button type="submit">Create</Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }



"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";

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

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
type CreateFormValues = z.infer<typeof createSchema>;

export default function CreateUserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", email: "" },
  });

  function onSubmit(values: CreateFormValues) {
    dispatch(createUser(values));
    router.push("/users");
  }

  return (
    <div className="p-6 max-w-md mx-auto ">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 bg-white  p-6 rounded shadow"
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
                  Valid email required.
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
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
