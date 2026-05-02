"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useGetAssignmentQuery } from "@/lib/api/assignmentApi";
import { useSubmitAssignmentMutation } from "@/lib/api/submissionApi";

export default function StudentAssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { data } = useGetAssignmentQuery(assignmentId);
  const [submitAssignment] = useSubmitAssignmentMutation();
  async function submit() {
    await submitAssignment({ assignmentId, contentText: "Submitted from LMS UI draft" }).unwrap();
    toast.success("Submission uploaded");
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader><CardTitle>{data?.title ?? "Assignment"}</CardTitle><CardDescription>{data?.className} · Due {data?.dueDate ? new Date(data.dueDate).toLocaleString() : ""}</CardDescription></CardHeader>
        <CardContent className="grid gap-4">
          <div className="prose max-w-none text-sm dark:prose-invert">{data?.description ?? "Instructions and attachments appear here."}</div>
          <div className="rounded-md border p-4 text-sm"><p className="font-medium">Rubric</p><p className="text-muted-foreground">{data?.rubric ?? "Rubric placeholder"}</p></div>
          <Textarea placeholder="Text entry with auto-save draft placeholder" />
          <div className="rounded-md border border-dashed p-6 text-center text-sm"><Upload className="mx-auto mb-2 h-5 w-5" />Drag and drop files or choose a file. Max size and allowed types come from assignment settings.</div>
          <Button onClick={submit}>Submit assignment</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <p>Countdown: {data?.dueDate ? Math.max(0, Math.ceil((new Date(data.dueDate).getTime() - Date.now()) / 86400000)) : 0} days</p>
          <p>Late penalty: {data?.latePenaltyPerDay ?? 0} points/day</p>
          <p className="flex gap-2 rounded-md bg-muted p-3"><AlertTriangle className="h-4 w-4" />Work submitted here should be your own.</p>
          <Button variant="outline">Ask question</Button>
        </CardContent>
      </Card>
    </div>
  );
}

