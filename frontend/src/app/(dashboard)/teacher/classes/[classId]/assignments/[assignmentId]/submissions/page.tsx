"use client";

import { useParams } from "next/navigation";
import { Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetSubmissionsQuery, useGradeSubmissionMutation, useReleaseSubmissionMutation } from "@/lib/api/submissionApi";
import type { Submission } from "@/types";

export default function AssignmentSubmissionsPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { data } = useGetSubmissionsQuery({ assignmentId });
  const [gradeSubmission] = useGradeSubmissionMutation();
  const [releaseSubmission] = useReleaseSubmissionMutation();

  async function saveGrade(submission: Submission, formData: FormData, draft: boolean) {
    await gradeSubmission({
      id: submission.id,
      grade: Number(formData.get("grade") ?? 0),
      feedback: String(formData.get("feedback") ?? ""),
      draft
    }).unwrap();
    toast.success(draft ? "Draft grade saved" : "Grade released");
  }

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
            <TableBody>{(data?.content ?? []).map((s) => <TableRow key={s.id}><TableCell>{s.studentName}</TableCell><TableCell>{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : "Missing"}</TableCell><TableCell>{s.status}</TableCell><TableCell colSpan={3}><form className="grid gap-2 md:grid-cols-[6rem_1fr_auto_auto]" onSubmit={async (event) => { event.preventDefault(); await saveGrade(s, new FormData(event.currentTarget), true); }}><Input name="grade" type="number" className="w-24" defaultValue={s.grade ?? ""} /><Textarea name="feedback" className="min-h-16" defaultValue={s.feedback} /><Button size="sm" variant="outline">Save draft</Button><Button size="sm" type="button" onClick={async (event) => { const form = event.currentTarget.closest("form"); if (form) await saveGrade(s, new FormData(form), false); await releaseSubmission(s.id).unwrap(); }}>Release</Button></form></TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
