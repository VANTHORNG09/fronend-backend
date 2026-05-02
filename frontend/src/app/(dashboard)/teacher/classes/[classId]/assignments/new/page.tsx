"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AssignmentForm } from "@/components/forms/assignment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateAssignmentMutation } from "@/lib/api/assignmentApi";
import type { AssignmentFormValues } from "@/lib/schemas/assignment.schema";

export default function NewAssignmentPage() {
  const { classId } = useParams<{ classId: string }>();
  const router = useRouter();
  const [createAssignment, state] = useCreateAssignmentMutation();
  async function submit(values: AssignmentFormValues) {
    await createAssignment({ ...values, dueDate: new Date(values.dueDate).toISOString(), publishDate: values.publishDate ? new Date(values.publishDate).toISOString() : undefined }).unwrap();
    toast.success("Assignment saved");
    router.push(`/teacher/classes/${classId}`);
  }
  return <Card><CardHeader><CardTitle>Create assignment</CardTitle></CardHeader><CardContent><AssignmentForm classId={classId} loading={state.isLoading} onSubmit={submit} /></CardContent></Card>;
}

