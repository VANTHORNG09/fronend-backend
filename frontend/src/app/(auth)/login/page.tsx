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
import { useLoginMutation } from "@/lib/api/authApi";
import { useAppDispatch } from "@/lib/hooks/redux";
import { loginSchema, type LoginValues } from "@/lib/schemas/auth.schema";
import { setCredentials } from "@/lib/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: process.env.NEXT_PUBLIC_DEMO_EMAIL || "admin@lms.local",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    try {
      const result = await login(values).unwrap();
      
      // Dispatch credentials to Redux store
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }));
      
      toast.success("Signed in successfully");
      router.push("/dashboard");
      router.refresh(); // Refresh server components for auth state
    } catch (error: any) {
      if (error?.status === "FETCH_ERROR") {
        toast.error("Cannot connect to API. Is the backend running at http://localhost:8080?");
        return;
      }
      const message = error?.data?.message || error?.message || "Invalid email or password";
      toast.error(message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpenCheck className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl">Sign in to AssignBridge</CardTitle>
          <CardDescription>
            Use your credentials or try a demo account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link 
              href="/register" 
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </div>

          <div className="mt-6 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo accounts:</p>
            <ul className="space-y-1">
              <li>admin@lms.local / Password123!</li>
              <li>teacher@lms.local / Password123!</li>
              <li>student@lms.local / Password123!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}