"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { assignmentSchema, type AssignmentFormValues } from "@/lib/schemas/assignment.schema";

export function AssignmentForm({ classId, onSubmit, loading }: { classId?: string; onSubmit: (values: AssignmentFormValues) => void; loading?: boolean }) {
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      classId: classId ?? "",
      title: "",
      description: "",
      dueDate: "",
      publishDate: "",
      maxPoints: 100,
      type: "TEXT_ENTRY",
      allowLate: true,
      latePenaltyPerDay: 0,
      rubric: "",
      draft: true
    }
  });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div><Label>Class ID</Label><Input {...form.register("classId")} readOnly={Boolean(classId)} /></div>
      <div><Label>Title</Label><Input {...form.register("title")} /></div>
      <div><Label>Instructions</Label><Textarea {...form.register("description")} /></div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div><Label>Due date</Label><Input type="datetime-local" {...form.register("dueDate")} /></div>
        <div><Label>Publish date</Label><Input type="datetime-local" {...form.register("publishDate")} /></div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <div><Label>Max points</Label><Input type="number" {...form.register("maxPoints")} /></div>
        <div>
          <Label>Type</Label>
          <Select defaultValue="TEXT_ENTRY" onValueChange={(v) => form.setValue("type", v as AssignmentFormValues["type"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT_ENTRY">Text entry</SelectItem>
              <SelectItem value="FILE_UPLOAD">File upload</SelectItem>
              <SelectItem value="QUIZ">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Late penalty/day</Label><Input type="number" {...form.register("latePenaltyPerDay")} /></div>
      </div>
      <div><Label>Rubric JSON/Text</Label><Textarea {...form.register("rubric")} /></div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm"><Switch checked={form.watch("allowLate")} onCheckedChange={(v) => form.setValue("allowLate", v)} /> Allow late</label>
        <label className="flex items-center gap-2 text-sm"><Switch checked={form.watch("draft")} onCheckedChange={(v) => form.setValue("draft", v)} /> Save as draft</label>
      </div>
      <Button disabled={loading}>{loading ? "Saving..." : "Save assignment"}</Button>
    </form>
  );
}

