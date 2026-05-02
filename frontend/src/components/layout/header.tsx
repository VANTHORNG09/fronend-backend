"use client";

import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clearCredentials } from "@/lib/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";

export function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  function logout() {
    dispatch(clearCredentials());
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="text-lg font-semibold">{user ? `${user.firstName} ${user.lastName}` : "Learning workspace"}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <Badge className="-ml-2 -mt-4 h-5 px-1">3</Badge>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

