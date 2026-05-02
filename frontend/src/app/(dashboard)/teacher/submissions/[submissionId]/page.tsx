"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetSubmissionQuery } from "@/lib/api/submissionApi";

export default function TeacherSubmissionPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const { data } = useGetSubmissionQuery(submissionId);
  return (
    <Card>
      <CardHeader><CardTitle>Review {data?.assignmentTitle ?? "submission"}</CardTitle></CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-md border p-4 text-sm">{data?.contentText ?? "File preview placeholder for image/pdf submissions."}</div>
        <Input type="number" placeholder="Score" defaultValue={data?.grade} />
        <Textarea placeholder="Feedback" defaultValue={data?.feedback} />
        <Button>Save grade</Button>
      </CardContent>
    </Card>
  );
}

