"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterMutation } from "@/lib/api/authApi";
import { useAppDispatch } from "@/lib/hooks/redux";
import { registerSchema, type RegisterValues } from "@/lib/schemas/auth.schema";
import { setCredentials } from "@/lib/store/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  async function onSubmit(values: RegisterValues) {
    const { confirmPassword, ...payload } = values;
    
    try {
      const result = await register(payload).unwrap();
      
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }));
      
      toast.success("Account created! Welcome to AssignBridge.");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      if (error?.status === "FETCH_ERROR") {
        toast.error("Cannot connect to API. Is the backend running?");
        return;
      }
      const message = error?.data?.message || error?.message || "Registration failed";
      
      // Handle specific validation errors
      if (message.toLowerCase().includes("email")) {
        toast.error("This email is already registered");
        form.setError("email", { message: "Email already in use" });
      } else {
        toast.error(message);
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpenCheck className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Join AssignBridge to manage your assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                autoComplete="name"
                disabled={isLoading}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.local"
                autoComplete="email"
                disabled={isLoading}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="grid gap-2">
              <Label>Account type</Label>
              <Select
                defaultValue="student"
                onValueChange={(value) => form.setValue("role", value as "student" | "teacher")}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Teacher accounts may require admin approval
              </p>
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link 
              href="/login" 
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}