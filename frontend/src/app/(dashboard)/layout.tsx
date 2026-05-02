"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useMeQuery } from "@/lib/api/authApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { setCredentials } from "@/lib/store/slices/authSlice";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const existing = useAppSelector((state) => state.auth);
  const { data: me, isError } = useMeQuery();

  useEffect(() => {
    if (me && existing.accessToken && existing.refreshToken) {
      dispatch(setCredentials({ user: me, accessToken: existing.accessToken, refreshToken: existing.refreshToken }));
    }
  }, [dispatch, existing.accessToken, existing.refreshToken, me]);

  useEffect(() => {
    if (isError) router.push("/login");
  }, [isError, router]);

  const role = me?.role ?? existing.user?.role ?? "STUDENT";

  return (
    <div className="shell-grid min-h-screen">
      <Sidebar role={role} />
      <div className="min-w-0">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
      </div>
    </div>
  );
}

