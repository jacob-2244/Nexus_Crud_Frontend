"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateUser, fetchUsers } from "@/redux/slices/userSlice";
import { useRouter, useParams } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const updateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
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

  // If user not loaded yet, fetch users; when fetched, reset form values
  useEffect(() => {
    if (!user) {
      dispatch(fetchUsers());
    } else {
      form.reset({ name: user.name, email: user.email });
    }
  }, [dispatch, user]);

  function onSubmit(values: UpdateFormValues) {
    dispatch(updateUser({ id: Number(id), name: values.name, email: values.email }));
    router.push("/users");
  }

  if (loading || !user) return <p className="p-6 text-gray-500">Loading user...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>

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
                <FormDescription>Display name min 2 characters.</FormDescription>
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
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormDescription>Email should be in proper format</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
