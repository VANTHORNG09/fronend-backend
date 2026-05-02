"use client";

import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetClassesQuery } from "@/lib/api/classApi";

export default function StudentClassesPage() {
  const { data } = useGetClassesQuery({});
  return (
    <div className="grid gap-5">
      <section className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div><h2 className="text-2xl font-semibold">My Classes</h2><p className="text-sm text-muted-foreground">Enrolled classes, unread announcements, timelines, grades, and class joining.</p></div>
        <Dialog><DialogTrigger asChild><Button><Plus className="h-4 w-4" />Join class</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Join with class code</DialogTitle></DialogHeader><Input placeholder="Class code" /><Button>Join</Button></DialogContent></Dialog>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data?.content ?? []).map((item) => (
          <Card key={item.id}>
            <CardHeader><CardTitle>{item.name}</CardTitle><CardDescription>{item.teacherName ?? "Teacher"} · next due in 7 days</CardDescription></CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-md bg-muted p-3 text-sm">Overall grade: 88% · Unread announcements: 2</div>
              <div className="flex gap-2"><Button asChild size="sm"><Link href={`/student/classes/${item.id}`}>Open</Link></Button><Button variant="outline" size="sm"><LogOut className="h-4 w-4" />Drop</Button></div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

