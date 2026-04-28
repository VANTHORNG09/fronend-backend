"use client";

import Link from "next/link";
import { BarChart3, BellPlus, Copy, Pin, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAnnouncementMutation } from "@/lib/api/announcementApi";
import { useGetClassesQuery } from "@/lib/api/classApi";
import { useAppSelector } from "@/lib/hooks/redux";

export default function TeacherClassesPage() {
  const teacherId = useAppSelector((state) => state.auth.user?.id);
  const { data } = useGetClassesQuery({ teacherId });
  const [createAnnouncement, announcementState] = useCreateAnnouncementMutation();
  return (
    <div className="grid gap-5">
      <section className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div><h2 className="text-2xl font-semibold">My Classes</h2><p className="text-sm text-muted-foreground">Pinned classes, class codes, announcements, analytics, and assignment access.</p></div>
        <Input className="max-w-sm" placeholder="Search classes" />
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data?.content ?? []).map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">{item.name}<Pin className="h-4 w-4 text-muted-foreground" /></CardTitle>
              <CardDescription>{item.subject ?? "General"} · {item.studentCount} students · Code {item.classCode}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-md bg-muted p-2"><p className="font-semibold">4</p><p className="text-xs text-muted-foreground">Pending</p></div>
                <div className="rounded-md bg-muted p-2"><p className="font-semibold">2</p><p className="text-xs text-muted-foreground">Upcoming</p></div>
                <div className="rounded-md bg-muted p-2"><p className="font-semibold">87%</p><p className="text-xs text-muted-foreground">Average</p></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm"><Link href={`/teacher/classes/${item.id}`}>Open</Link></Button>
                <Button asChild size="sm" variant="outline"><Link href={`/teacher/classes/${item.id}/assignments/new`}><Plus className="h-4 w-4" />Assignment</Link></Button>
                <Button size="sm" variant="outline"><Copy className="h-4 w-4" />Code</Button>
                <Dialog>
                  <DialogTrigger asChild><Button size="sm" variant="ghost"><BellPlus className="h-4 w-4" /></Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Post announcement</DialogTitle></DialogHeader>
                    <form className="grid gap-3" onSubmit={async (event) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      await createAnnouncement({ classId: item.id, title: String(formData.get("title")), message: String(formData.get("message")) }).unwrap();
                      toast.success("Announcement posted");
                      event.currentTarget.reset();
                    }}>
                      <Input name="title" placeholder="Title" required />
                      <Textarea name="message" placeholder="Message" required />
                      <Button disabled={announcementState.isLoading}>Post</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="ghost"><BarChart3 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
