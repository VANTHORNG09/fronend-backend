"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/lib/api/authApi";
import { useAppDispatch } from "@/lib/hooks/redux";
import { loginSchema, type LoginValues } from "@/lib/schemas/auth.schema";
import { setCredentials } from "@/lib/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "admin@lms.local", password: "Password123!" } });

  async function onSubmit(values: LoginValues) {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      toast.success("Signed in");
      router.push("/dashboard");
    } catch (error) {
      if (typeof error === "object" && error !== null && "status" in error && error.status === "FETCH_ERROR") {
        toast.error("Cannot reach the backend API at http://localhost:8080/api");
        return;
      }
      toast.error("Invalid email or password");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpenCheck className="h-5 w-5" />
          </div>
          <CardTitle>Sign in to LMS</CardTitle>
          <CardDescription>Use the seeded demo accounts or an admin-created account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div><Label>Email</Label><Input type="email" {...form.register("email")} /></div>
            <div><Label>Password</Label><Input type="password" {...form.register("password")} /></div>
            <Button disabled={isLoading}>{isLoading ? "Signing in..." : "Sign in"}</Button>
          </form>
          <div className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            Demo: admin@lms.local, teacher@lms.local, student@lms.local. Password: Password123!
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
