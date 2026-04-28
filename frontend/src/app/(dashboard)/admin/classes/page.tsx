"use client";

import { Copy, Link2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAssignTeacherMutation, useCopyClassMutation, useCreateClassMutation, useGetClassesQuery, useGetClassStudentsQuery, useAddClassStudentsMutation, useRemoveClassStudentMutation } from "@/lib/api/classApi";
import { useGetUsersQuery } from "@/lib/api/userApi";
import type { LmsClass, User } from "@/types";

export default function AdminClassesPage() {
  const { data } = useGetClassesQuery({});
  const { data: teachers } = useGetUsersQuery({ role: "TEACHER" });
  const { data: students } = useGetUsersQuery({ role: "STUDENT" });
  const [createClass, createState] = useCreateClassMutation();

  async function submit(formData: FormData) {
    const endDate = String(formData.get("endDate") ?? "");
    await createClass({
      name: String(formData.get("name")),
      description: String(formData.get("description")),
      subject: String(formData.get("subject")),
      schedule: String(formData.get("schedule")),
      teacherId: String(formData.get("teacherId")) || undefined,
      endDate: endDate || undefined
    }).unwrap();
    toast.success("Class created");
  }

  return (
    <div className="grid gap-5">
      <section className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div><h2 className="text-2xl font-semibold">Class Management</h2><p className="text-sm text-muted-foreground">Create, archive, invite, copy, and analyze classes.</p></div>
        <Dialog>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4" />Create class</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create class</DialogTitle></DialogHeader>
            <form action={submit} className="grid gap-4">
              <div><Label>Name</Label><Input name="name" required /></div>
              <div><Label>Subject</Label><Input name="subject" /></div>
              <div><Label>Description</Label><Textarea name="description" /></div>
              <div><Label>Teacher</Label><select name="teacherId" className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="">Unassigned</option>{(teachers?.content ?? []).map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>)}</select></div>
              <div className="grid gap-2 sm:grid-cols-2"><div><Label>Schedule</Label><Input name="schedule" /></div><div><Label>End date</Label><Input type="date" name="endDate" /></div></div>
              <Button disabled={createState.isLoading}>Save class</Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>
      <Card>
        <CardHeader><CardTitle>Classes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Class Name</TableHead><TableHead>Teacher</TableHead><TableHead>Students</TableHead><TableHead>Status</TableHead><TableHead>Code</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {(data?.content ?? []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.teacherName ?? "Unassigned"}</TableCell>
                  <TableCell>{item.studentCount}</TableCell>
                  <TableCell><Badge variant={item.status === "ACTIVE" ? "default" : "outline"}>{item.status}</Badge></TableCell>
                  <TableCell>{item.classCode}</TableCell>
                  <TableCell><ClassActions klass={item} teachers={teachers?.content ?? []} students={students?.content ?? []} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ClassActions({ klass, teachers, students }: { klass: LmsClass; teachers: User[]; students: User[] }) {
  const { data: enrolled = [] } = useGetClassStudentsQuery(klass.id);
  const [assignTeacher] = useAssignTeacherMutation();
  const [addStudents] = useAddClassStudentsMutation();
  const [removeStudent] = useRemoveClassStudentMutation();
  const [copyClass] = useCopyClassMutation();

  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline" size="sm">Manage</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Manage {klass.name}</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="rounded-md border p-3 text-sm">
            <p className="font-medium">Invite code</p>
            <p className="text-muted-foreground">{klass.classCode}</p>
            <Button className="mt-2" variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(klass.classCode)}><Link2 className="h-4 w-4" />Copy code</Button>
          </div>
          <form className="grid gap-2" onSubmit={async (event) => { event.preventDefault(); const formData = new FormData(event.currentTarget); await assignTeacher({ classId: klass.id, teacherId: String(formData.get("teacherId")) }).unwrap(); toast.success("Teacher assigned"); }}>
            <Label>Assign teacher</Label>
            <select name="teacherId" className="h-10 rounded-md border bg-background px-3 text-sm" defaultValue={klass.teacherId ?? ""}>{teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>)}</select>
            <Button size="sm">Save teacher</Button>
          </form>
          <form className="grid gap-2" onSubmit={async (event) => { event.preventDefault(); const formData = new FormData(event.currentTarget); await addStudents({ classId: klass.id, studentIds: [String(formData.get("studentId"))] }).unwrap(); toast.success("Student added"); }}>
            <Label>Add student</Label>
            <select name="studentId" className="h-10 rounded-md border bg-background px-3 text-sm">{students.map((student) => <option key={student.id} value={student.id}>{student.firstName} {student.lastName}</option>)}</select>
            <Button size="sm">Add student</Button>
          </form>
          <div className="grid gap-2">
            <Label>Enrolled students</Label>
            {enrolled.length === 0 ? <p className="text-sm text-muted-foreground">No students enrolled.</p> : enrolled.map((student) => <div key={student.id} className="flex items-center justify-between rounded-md border p-2 text-sm"><span>{student.firstName} {student.lastName}</span><Button size="sm" variant="outline" onClick={async () => { await removeStudent({ classId: klass.id, studentId: student.id }).unwrap(); toast.success("Student removed"); }}>Remove</Button></div>)}
          </div>
          <Button variant="outline" onClick={async () => { await copyClass(klass.id).unwrap(); toast.success("Class copied"); }}><Copy className="h-4 w-4" />Copy class</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
