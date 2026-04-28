"use client";

import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAssignmentsQuery } from "@/lib/api/assignmentApi";
import { useGetAnnouncementsQuery } from "@/lib/api/announcementApi";
import { useGetClassQuery, useGetClassStudentsQuery } from "@/lib/api/classApi";

export default function TeacherClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const { data: klass } = useGetClassQuery(classId);
  const { data: students } = useGetClassStudentsQuery(classId);
  const { data: assignments } = useGetAssignmentsQuery({ classId });
  const { data: announcements = [] } = useGetAnnouncementsQuery(classId);

  return (
    <div className="grid gap-5">
      <section className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div><h2 className="text-2xl font-semibold">{klass?.name ?? "Class"}</h2><p className="text-sm text-muted-foreground">Students, assignments, announcements, gradebook, attendance, and calendar.</p></div>
        <div className="flex gap-2"><Button asChild><Link href={`/teacher/classes/${classId}/assignments/new`}><Plus className="h-4 w-4" />Add assignment</Link></Button><Button variant="outline"><Download className="h-4 w-4" />Roster CSV</Button></div>
      </section>
      <Tabs defaultValue="students">
        <TabsList className="flex flex-wrap"><TabsTrigger value="students">Students</TabsTrigger><TabsTrigger value="assignments">Assignments</TabsTrigger><TabsTrigger value="announcements">Announcements</TabsTrigger><TabsTrigger value="gradebook">Gradebook</TabsTrigger></TabsList>
        <TabsContent value="students">
          <Card><CardHeader><CardTitle>Students</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Latest Summary</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{(students ?? []).map((student) => <TableRow key={student.id}><TableCell>{student.firstName} {student.lastName}</TableCell><TableCell>{student.email}</TableCell><TableCell>Submitted 3 · Pending 1</TableCell><TableCell><Button variant="outline" size="sm">Remove</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="assignments">
          <Card><CardHeader><CardTitle>Assignments</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Due</TableHead><TableHead>Submissions</TableHead><TableHead>Average</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{(assignments?.content ?? []).map((assignment) => <TableRow key={assignment.id}><TableCell>{assignment.title}</TableCell><TableCell>{new Date(assignment.dueDate).toLocaleString()}</TableCell><TableCell>12/20</TableCell><TableCell>86%</TableCell><TableCell className="flex flex-wrap gap-2"><Button asChild variant="outline" size="sm"><Link href={`/teacher/classes/${classId}/assignments/${assignment.id}`}>Edit</Link></Button><Button asChild variant="outline" size="sm"><Link href={`/teacher/classes/${classId}/assignments/${assignment.id}/submissions`}>View submissions</Link></Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="announcements">
          <Card><CardHeader><CardTitle>Announcements</CardTitle></CardHeader><CardContent className="grid gap-3">{announcements.length === 0 ? <p className="text-sm text-muted-foreground">No announcements yet.</p> : announcements.map((announcement) => <div key={announcement.id} className="rounded-md border p-3"><p className="font-medium">{announcement.title}</p><p className="text-sm text-muted-foreground">{announcement.message}</p><p className="mt-2 text-xs text-muted-foreground">{announcement.teacherName} · {new Date(announcement.createdAt).toLocaleString()}</p></div>)}</CardContent></Card>
        </TabsContent>
        <TabsContent value="gradebook">
          <Card><CardHeader><CardTitle>Gradebook</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Student</TableHead>{(assignments?.content ?? []).map((a) => <TableHead key={a.id}>{a.title}</TableHead>)}<TableHead>Average</TableHead></TableRow></TableHeader><TableBody>{(students ?? []).map((s) => <TableRow key={s.id}><TableCell>{s.firstName} {s.lastName}</TableCell>{(assignments?.content ?? []).map((a) => <TableCell key={a.id}><Badge variant="outline">--</Badge></TableCell>)}<TableCell>--</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
