"use client";

import { useParams } from "next/navigation";
import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetSubmissionsQuery } from "@/lib/api/submissionApi";

export default function AssignmentSubmissionsPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { data } = useGetSubmissionsQuery({ assignmentId });
  return (
    <div className="grid gap-5">
      <section className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div><h2 className="text-2xl font-semibold">Submission Review</h2><p className="text-sm text-muted-foreground">Preview, grade, draft feedback, release, bulk update, and remind missing students.</p></div>
        <div className="flex gap-2"><Button variant="outline"><Download className="h-4 w-4" />Download zip</Button><Button variant="outline"><Mail className="h-4 w-4" />Send reminders</Button></div>
      </section>
      <Card>
        <CardHeader><CardTitle>Submissions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Submitted</TableHead><TableHead>Status</TableHead><TableHead>Grade</TableHead><TableHead>Feedback</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
            <TableBody>{(data?.content ?? []).map((s) => <TableRow key={s.id}><TableCell>{s.studentName}</TableCell><TableCell>{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : "Missing"}</TableCell><TableCell>{s.status}</TableCell><TableCell><Input className="w-24" defaultValue={s.grade ?? ""} /></TableCell><TableCell><Textarea className="min-h-16" defaultValue={s.feedback} /></TableCell><TableCell><Button size="sm">Release</Button></TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

