"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAssignmentsQuery } from "@/lib/api/assignmentApi";
import { useGetSubmissionsQuery } from "@/lib/api/submissionApi";
import type { Assignment } from "@/types";

type AssignmentFilter = "all" | "pending" | "submitted" | "late" | "graded";

export default function StudentAssignmentsPage() {
  const { data } = useGetAssignmentsQuery({});
  const { data: submissions } = useGetSubmissionsQuery({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AssignmentFilter>("all");
  const [sort, setSort] = useState<"due" | "created">("due");
  const submissionByAssignment = useMemo(() => new Map((submissions?.content ?? []).map((submission) => [submission.assignmentId, submission])), [submissions]);
  const assignments = useMemo(() => {
    return [...(data?.content ?? [])]
      .filter((assignment) => assignment.title.toLowerCase().includes(search.toLowerCase()))
      .filter((assignment) => status === "all" || getStudentStatus(assignment, submissionByAssignment) === status)
      .sort((a, b) => new Date(sort === "due" ? a.dueDate : a.createdAt).getTime() - new Date(sort === "due" ? b.dueDate : b.createdAt).getTime());
  }, [data, search, sort, status, submissionByAssignment]);

  return (
    <div className="grid gap-5">
      <section className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div><h2 className="text-2xl font-semibold">Assignments</h2><p className="text-sm text-muted-foreground">Filter by class/status, sort by due date, toggle reminders, and view grades.</p></div>
        <Button variant="outline"><CalendarDays className="h-4 w-4" />Calendar view</Button>
      </section>
      <Card>
        <CardHeader className="grid gap-3"><CardTitle>All assignments</CardTitle><div className="grid gap-2 md:grid-cols-4"><Input placeholder="Search title" value={search} onChange={(event) => setSearch(event.target.value)} /><Select><SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger><SelectContent><SelectItem value="all">All classes</SelectItem></SelectContent></Select><Select value={status} onValueChange={(value) => setStatus(value as AssignmentFilter)}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="submitted">Submitted</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="graded">Graded</SelectItem></SelectContent></Select><Select value={sort} onValueChange={(value) => setSort(value as "due" | "created")}><SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger><SelectContent><SelectItem value="due">Due date</SelectItem><SelectItem value="created">Creation date</SelectItem></SelectContent></Select></div></CardHeader>
        <CardContent>
          <Table><TableHeader><TableRow><TableHead>Assignment</TableHead><TableHead>Class</TableHead><TableHead>Due</TableHead><TableHead>Status</TableHead><TableHead>Grade</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{assignments.map((a) => { const submission = submissionByAssignment.get(a.id); const currentStatus = getStudentStatus(a, submissionByAssignment); return <TableRow key={a.id}><TableCell className="font-medium">{a.title}</TableCell><TableCell>{a.className}</TableCell><TableCell>{new Date(a.dueDate).toLocaleString()}</TableCell><TableCell><Badge variant={currentStatus === "late" ? "destructive" : currentStatus === "submitted" || currentStatus === "graded" ? "default" : "secondary"}>{currentStatus}</Badge></TableCell><TableCell>{submission?.grade ?? "--"}</TableCell><TableCell><Button asChild size="sm"><Link href={`/student/assignments/${a.id}`}>Open</Link></Button></TableCell></TableRow>; })}</TableBody></Table>
        </CardContent>
      </Card>
    </div>
  );
}

function getStudentStatus(assignment: Assignment, submissions: Map<string, { status: string; grade?: number }>): AssignmentFilter {
  const submission = submissions.get(assignment.id);
  if (submission?.status === "GRADED" || submission?.status === "RETURNED") return "graded";
  if (submission) return "submitted";
  return new Date(assignment.dueDate).getTime() < Date.now() ? "late" : "pending";
}
