"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, ClipboardList, GraduationCap, LayoutDashboard, Settings, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Role } from "@/types";

const nav = {
  ADMIN: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/classes", label: "Classes", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: Settings }
  ],
  TEACHER: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/classes", label: "My Classes", icon: BookOpen },
    { href: "/teacher/classes", label: "Submissions", icon: ClipboardList },
    { href: "/profile", label: "Profile", icon: Settings }
  ],
  STUDENT: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/classes", label: "My Classes", icon: GraduationCap },
    { href: "/student/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/student/submissions", label: "Submissions", icon: BarChart3 },
    { href: "/profile", label: "Profile", icon: Settings }
  ]
} satisfies Record<Role, Array<{ href: string; label: string; icon: typeof LayoutDashboard }>>;

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  return (
    <aside className="hidden min-h-screen border-r bg-card px-3 py-4 md:block">
      <div className="mb-6 flex items-center gap-2 px-2 text-lg font-semibold">
        <ShieldCheck className="h-5 w-5 text-primary" />
        LMS
      </div>
      <nav className="space-y-1">
        {nav[role].map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground", active && "bg-muted text-foreground")}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
