"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAssignmentsQuery } from "@/lib/api/assignmentApi";

export default function StudentAssignmentsPage() {
  const { data } = useGetAssignmentsQuery({});
  return (
    <div className="grid gap-5">
      <section className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div><h2 className="text-2xl font-semibold">Assignments</h2><p className="text-sm text-muted-foreground">Filter by class/status, sort by due date, toggle reminders, and view grades.</p></div>
        <Button variant="outline"><CalendarDays className="h-4 w-4" />Calendar view</Button>
      </section>
      <Card>
        <CardHeader className="grid gap-3"><CardTitle>All assignments</CardTitle><div className="grid gap-2 md:grid-cols-4"><Input placeholder="Search title" /><Select><SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger><SelectContent><SelectItem value="all">All classes</SelectItem></SelectContent></Select><Select><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="graded">Graded</SelectItem></SelectContent></Select><Select><SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger><SelectContent><SelectItem value="due">Due date</SelectItem><SelectItem value="created">Creation date</SelectItem></SelectContent></Select></div></CardHeader>
        <CardContent>
          <Table><TableHeader><TableRow><TableHead>Assignment</TableHead><TableHead>Class</TableHead><TableHead>Due</TableHead><TableHead>Status</TableHead><TableHead>Grade</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{(data?.content ?? []).map((a) => <TableRow key={a.id}><TableCell className="font-medium">{a.title}</TableCell><TableCell>{a.className}</TableCell><TableCell>{new Date(a.dueDate).toLocaleString()}</TableCell><TableCell><Badge variant="secondary">Pending</Badge></TableCell><TableCell>--</TableCell><TableCell><Button asChild size="sm"><Link href={`/student/assignments/${a.id}`}>Open</Link></Button></TableCell></TableRow>)}</TableBody></Table>
        </CardContent>
      </Card>
    </div>
  );
}

