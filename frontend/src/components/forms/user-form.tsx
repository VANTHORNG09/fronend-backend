"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userSchema, type UserFormValues } from "@/lib/schemas/user.schema";

export function UserForm({ onSubmit, loading }: { onSubmit: (values: UserFormValues) => void; loading?: boolean }) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { firstName: "", lastName: "", email: "", role: "STUDENT", initialPassword: "" }
  });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-2 sm:grid-cols-2">
        <div><Label>First name</Label><Input {...form.register("firstName")} /></div>
        <div><Label>Last name</Label><Input {...form.register("lastName")} /></div>
      </div>
      <div><Label>Email</Label><Input type="email" {...form.register("email")} /></div>
      <div>
        <Label>Role</Label>
        <Select defaultValue="STUDENT" onValueChange={(v) => form.setValue("role", v as UserFormValues["role"])}>
          <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="TEACHER">Teacher</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>Initial password</Label><Input type="password" {...form.register("initialPassword")} placeholder="Auto-generate if blank" /></div>
      <Button disabled={loading}>{loading ? "Saving..." : "Save user"}</Button>
    </form>
  );
}

