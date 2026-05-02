"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/types";

export function ProfileForm({ user, onSubmit, loading }: { user: User; onSubmit: (values: Partial<User>) => void; loading?: boolean }) {
  const form = useForm<Partial<User>>({ defaultValues: user });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-2 sm:grid-cols-2">
        <div><Label>First name</Label><Input {...form.register("firstName")} /></div>
        <div><Label>Last name</Label><Input {...form.register("lastName")} /></div>
      </div>
      <div><Label>Email</Label><Input type="email" {...form.register("email")} /></div>
      <div><Label>Avatar URL</Label><Input {...form.register("avatarUrl")} placeholder="/uploads/placeholder/avatar.png" /></div>
      <Button disabled={loading}>{loading ? "Saving..." : "Save profile"}</Button>
    </form>
  );
}

