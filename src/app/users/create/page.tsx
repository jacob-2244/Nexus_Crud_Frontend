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

// Superadmin is excluded — it can only be accessed via the dedicated login page
const ASSIGNABLE_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.GUEST];

const ROLE_LABELS: Record<string, string> = {
  [UserRole.ADMIN]:   "Admin",
  [UserRole.MANAGER]: "Manager",
  [UserRole.GUEST]:   "Guest",
};

export default function CreateUserPage() {
  const router = useRouter();
  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", email: "", role: UserRole.MANAGER },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function onSubmit(values: CreateFormValues) {
    // Extra guard — never submit superadmin role
    if (values.role === UserRole.SUPERADMIN) {
      setMessage("Invalid role selected");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        setMessage(error.message || "Failed to create user");
        setIsError(true);
        setLoading(false);
        return;
      }

      setMessage("User created successfully!");
      setIsError(false);
      form.reset();
    } catch (err) {
      setMessage("Something went wrong");
      setIsError(true);
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
                <FormControl><Input placeholder="Enter name" {...field} /></FormControl>
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
                <FormControl><Input placeholder="email@example.com" {...field} /></FormControl>
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
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ASSIGNABLE_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select user role.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {message && (
            <p className={isError ? "text-red-500" : "text-green-500"}>{message}</p>
          )}

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