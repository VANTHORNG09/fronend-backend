"use client";

import { ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProfileForm } from "@/components/forms/profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChangePasswordMutation, useDisable2faMutation, useEnable2faMutation, useGetActivityLogQuery, useGetProfileQuery, useUpdateProfileMutation } from "@/lib/api/profileApi";

export default function ProfilePage() {
  const { data: user } = useGetProfileQuery();
  const [updateProfile, updateState] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const [enable2fa] = useEnable2faMutation();
  const [disable2fa] = useDisable2faMutation();
  const { data: activity = [] } = useGetActivityLogQuery();

  if (!user) return null;

  return (
    <div className="grid gap-5">
      <section><h2 className="text-2xl font-semibold">Profile</h2><p className="text-sm text-muted-foreground">Identity, password, email verification placeholder, 2FA, activity, preferences, and account deletion.</p></section>
      <Tabs defaultValue="profile">
        <TabsList className="flex flex-wrap"><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger><TabsTrigger value="preferences">Preferences</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>
        <TabsContent value="profile">
          <Card><CardHeader><CardTitle>{user.firstName} {user.lastName}</CardTitle><CardDescription>{user.email} · {user.role} · Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "recently"}</CardDescription></CardHeader><CardContent><ProfileForm user={user} loading={updateState.isLoading} onSubmit={async (values) => { await updateProfile(values).unwrap(); toast.success("Profile updated"); }} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="security">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card><CardHeader><CardTitle>Change password</CardTitle></CardHeader><CardContent><form className="grid gap-3" onSubmit={async (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); await changePassword({ currentPassword: String(data.get("currentPassword")), newPassword: String(data.get("newPassword")) }).unwrap(); toast.success("Password changed"); }}><div><Label>Current password</Label><Input type="password" name="currentPassword" /></div><div><Label>New password</Label><Input type="password" name="newPassword" /></div><Button>Change password</Button></form></CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Two-factor authentication</CardTitle></CardHeader><CardContent className="grid gap-3"><p className="text-sm text-muted-foreground">TOTP QR code placeholder appears after enabling.</p><div className="flex items-center gap-3"><Switch checked={Boolean(user.twoFactorEnabled)} onCheckedChange={async (checked) => { checked ? await enable2fa().unwrap() : await disable2fa().unwrap(); toast.success("2FA setting updated"); }} /><span className="text-sm">{user.twoFactorEnabled ? "Enabled" : "Disabled"}</span></div><div className="rounded-md border p-4 text-xs text-muted-foreground">otpauth://totp/LMS:{user.email}?secret=PLACEHOLDER&issuer=LMS</div></CardContent></Card>
            <Card><CardHeader><CardTitle>Email change</CardTitle></CardHeader><CardContent className="grid gap-3"><Input defaultValue={user.email} /><Button variant="outline">Send verification email</Button></CardContent></Card>
            <Card><CardHeader><CardTitle>Delete account</CardTitle><CardDescription>Soft delete starts a 7-day cool-off period.</CardDescription></CardHeader><CardContent><Button variant="destructive"><Trash2 className="h-4 w-4" />Request deletion</Button></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="preferences">
          <Card><CardHeader><CardTitle>Notifications and display</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><label className="flex items-center justify-between rounded-md border p-3 text-sm">Email new assignments <Switch defaultChecked /></label><label className="flex items-center justify-between rounded-md border p-3 text-sm">In-app graded submissions <Switch defaultChecked /></label><label className="flex items-center justify-between rounded-md border p-3 text-sm">Class announcements <Switch defaultChecked /></label><div className="rounded-md border p-3 text-sm">Language: English · Theme syncs with system</div></CardContent></Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card><CardHeader><CardTitle>Account activity log</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm">{activity.length === 0 ? <div className="rounded-md border p-3">No account activity recorded yet.</div> : activity.map((item) => <div key={item.id} className="rounded-md border p-3"><p className="font-medium">{item.action}</p><p className="text-muted-foreground">{new Date(item.createdAt).toLocaleString()} · {item.ipAddress ?? "unknown IP"}</p><p className="truncate text-xs text-muted-foreground">{item.device}</p></div>)}</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
