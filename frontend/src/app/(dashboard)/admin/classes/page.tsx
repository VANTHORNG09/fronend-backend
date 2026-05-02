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
import { useCreateClassMutation, useGetClassesQuery } from "@/lib/api/classApi";

export default function AdminClassesPage() {
  const { data } = useGetClassesQuery({});
  const [createClass, createState] = useCreateClassMutation();

  async function submit(formData: FormData) {
    await createClass({
      name: String(formData.get("name")),
      description: String(formData.get("description")),
      subject: String(formData.get("subject")),
      schedule: String(formData.get("schedule")),
      endDate: String(formData.get("endDate"))
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
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="sm"><Link2 className="h-4 w-4" />Invite</Button>
                    <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

