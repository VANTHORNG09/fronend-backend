"use client";

import { Download, FileUp, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import { UserForm } from "@/components/forms/user-form";
import { LoadingRows } from "@/components/common/data-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateUserMutation, useGetUsersQuery, useUpdateUserStatusMutation } from "@/lib/api/userApi";
import type { Role, UserStatus } from "@/types";

export default function AdminUsersPage() {
  const { data, isLoading } = useGetUsersQuery({});
  const [createUser, createState] = useCreateUserMutation();
  const [updateStatus] = useUpdateUserStatusMutation();

  return (
    <div className="grid gap-5">
      <section className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">Search, filter, create, activate, deactivate, import, export, and audit LMS users.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><FileUp className="h-4 w-4" />Import CSV</Button>
          <Button variant="outline"><Download className="h-4 w-4" />Export CSV</Button>
          <Dialog>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4" />Add user</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add user</DialogTitle></DialogHeader>
              <UserForm loading={createState.isLoading} onSubmit={async (values) => {
                await createUser(values).unwrap();
                toast.success("User created");
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <Card>
        <CardHeader className="gap-3">
          <CardTitle>Users</CardTitle>
          <div className="grid gap-2 md:grid-cols-4">
            <Input placeholder="Search name or email" />
            <Select><SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger><SelectContent>{(["ADMIN", "TEACHER", "STUDENT"] as Role[]).map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{(["ACTIVE", "INACTIVE"] as UserStatus[]).map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select>
            <Input type="date" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <LoadingRows /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.content ?? []).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                    <TableCell><Switch checked={user.status === "ACTIVE"} onCheckedChange={(checked) => updateStatus({ id: user.id, status: checked ? "ACTIVE" : "INACTIVE" })} /></TableCell>
                    <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</TableCell>
                    <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

