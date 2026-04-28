"use client";

import Link from "next/link";
import { Activity, CalendarClock, ClipboardList, Plus, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardQuery } from "@/lib/api/dashboardApi";
import { useAppSelector } from "@/lib/hooks/redux";

const actionByRole = {
  ADMIN: [{ label: "Add user", href: "/admin/users" }, { label: "Create class", href: "/admin/classes" }],
  TEACHER: [{ label: "Create assignment", href: "/teacher/classes" }, { label: "Review submissions", href: "/teacher/classes" }],
  STUDENT: [{ label: "Pending assignments", href: "/student/assignments" }]
};

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardQuery();
  const role = useAppSelector((state) => state.auth.user?.role) ?? "STUDENT";
  const chart = data ? Object.values(data.charts)[0] ?? [] : [];

  if (isLoading) {
    return <div className="grid gap-4"><Skeleton className="h-24" /><Skeleton className="h-72" /></div>;
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold">{role.toLowerCase()} dashboard</h2>
          <p className="text-sm text-muted-foreground">Role-specific stats, activity, deadlines, and next actions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {actionByRole[role].map((action) => (
            <Button asChild key={action.label}>
              <Link href={action.href}><Plus className="h-4 w-4" />{action.label}</Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(data?.stats ?? {}).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardDescription>{key.replace(/([A-Z])/g, " $1")}</CardDescription>
              <CardTitle className="text-3xl">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Progress trend</CardTitle>
            <CardDescription>Admin growth, teacher submission rate, or student grade progress.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4" />Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data?.recentActivity.length ? data.recentActivity : [{ id: "0", action: "No recent activity yet", createdAt: new Date().toISOString() }]).slice(0, 5).map((item) => (
                <div key={item.id} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarClock className="h-4 w-4" />Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" />API Design Brief due soon</p>
              <p className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" />Notifications poll every 60 seconds</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader><CardTitle>Helpful tips</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(data?.tips ?? []).map((tip) => <span key={tip} className="rounded-md bg-muted px-3 py-2 text-sm">{tip}</span>)}
        </CardContent>
      </Card>
    </div>
  );
}
