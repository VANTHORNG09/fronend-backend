"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAssignmentsQuery } from "@/lib/api/assignmentApi";
import { useGetClassQuery } from "@/lib/api/classApi";

export default function StudentClassPage() {
  const { classId } = useParams<{ classId: string }>();
  const { data: klass } = useGetClassQuery(classId);
  const { data: assignments } = useGetAssignmentsQuery({ classId });
  return (
    <div className="grid gap-5">
      <h2 className="text-2xl font-semibold">{klass?.name ?? "Class timeline"}</h2>
      <Card><CardHeader><CardTitle>Timeline</CardTitle></CardHeader><CardContent className="grid gap-3">{(assignments?.content ?? []).map((assignment) => <div key={assignment.id} className="rounded-md border p-3"><p className="font-medium">{assignment.title}</p><p className="text-sm text-muted-foreground">Due {new Date(assignment.dueDate).toLocaleString()}</p></div>)}</CardContent></Card>
    </div>
  );
}

