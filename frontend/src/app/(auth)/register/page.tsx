import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Registration</CardTitle>
          <CardDescription>Self-registration is optional for this LMS.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Administrators can create teacher and student accounts from User Management. The backend also exposes protected `POST /api/auth/register`.
        </CardContent>
      </Card>
    </main>
  );
}

