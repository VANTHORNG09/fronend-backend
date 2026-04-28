"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AssignmentForm } from "@/components/forms/assignment-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteAssignmentMutation, useGetAssignmentQuery, useUpdateAssignmentMutation } from "@/lib/api/assignmentApi";
import type { AssignmentFormValues } from "@/lib/schemas/assignment.schema";

export default function EditAssignmentPage() {
  const { classId, assignmentId } = useParams<{ classId: string; assignmentId: string }>();
  const router = useRouter();
  const { data: assignment } = useGetAssignmentQuery(assignmentId);
  const [updateAssignment, updateState] = useUpdateAssignmentMutation();
  const [deleteAssignment, deleteState] = useDeleteAssignmentMutation();

  async function submit(values: AssignmentFormValues) {
    await updateAssignment({
      id: assignmentId,
      body: {
        ...values,
        dueDate: new Date(values.dueDate).toISOString(),
        publishDate: values.publishDate ? new Date(values.publishDate).toISOString() : undefined
      }
    }).unwrap();
    toast.success("Assignment updated");
    router.push(`/teacher/classes/${classId}`);
  }

  async function remove() {
    await deleteAssignment(assignmentId).unwrap();
    toast.success("Assignment deleted");
    router.push(`/teacher/classes/${classId}`);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Edit assignment</CardTitle>
        <Button variant="destructive" onClick={remove} disabled={deleteState.isLoading}>Delete assignment</Button>
      </CardHeader>
      <CardContent>{assignment ? <AssignmentForm classId={classId} assignment={assignment} loading={updateState.isLoading} onSubmit={submit} /> : null}</CardContent>
    </Card>
  );
}

