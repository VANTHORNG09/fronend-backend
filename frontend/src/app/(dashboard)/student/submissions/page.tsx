"use client";

import { Download } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetSubmissionsQuery } from "@/lib/api/submissionApi";

const trend = [{ label: "Jan", value: 74 }, { label: "Feb", value: 81 }, { label: "Mar", value: 86 }, { label: "Apr", value: 89 }];

export default function StudentSubmissionsPage() {
  const { data } = useGetSubmissionsQuery({});
  return (
    <div className="grid gap-5">
      <section className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h2 className="text-2xl font-semibold">My Submissions</h2><p className="text-sm text-muted-foreground">Submission history, grades, feedback, regrade requests, notes, and export.</p></div><Button variant="outline"><Download className="h-4 w-4" />Download feedback PDF</Button></section>
      <div className="grid gap-4 lg:grid-cols-[1fr_24rem]">
        <Card><CardHeader><CardTitle>History</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Assignment</TableHead><TableHead>Submitted</TableHead><TableHead>Status</TableHead><TableHead>Grade</TableHead><TableHead>Feedback</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{(data?.content ?? []).map((s) => <TableRow key={s.id}><TableCell>{s.assignmentTitle}</TableCell><TableCell>{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : "--"}</TableCell><TableCell>{s.status}</TableCell><TableCell>{s.grade ?? "--"}</TableCell><TableCell>{s.feedback ?? "--"}</TableCell><TableCell><Button size="sm" variant="outline">Appeal</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        <Card><CardHeader><CardTitle>Grade trend</CardTitle></CardHeader><CardContent className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={trend}><XAxis dataKey="label" /><YAxis /><Tooltip /><Line dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
      </div>
    </div>
  );
}

