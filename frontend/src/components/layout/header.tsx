"use client";

import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "@/lib/api/notificationApi";
import { clearCredentials } from "@/lib/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";

export function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, { pollingInterval: 60000 });
  const [markRead] = useMarkNotificationReadMutation();
  const unreadCount = notifications.filter((item) => !item.read).length;

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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 ? <Badge className="-ml-2 -mt-4 h-5 px-1">{unreadCount}</Badge> : null}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Notifications</DialogTitle></DialogHeader>
            <div className="grid gap-2">
              {notifications.length === 0 ? <p className="text-sm text-muted-foreground">No notifications yet.</p> : notifications.map((item) => (
                <button key={item.id} className="rounded-md border p-3 text-left text-sm hover:bg-muted" onClick={() => markRead(item.id)}>
                  <span className="font-medium">{item.type}</span>
                  <span className="block text-muted-foreground">{item.message}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
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
