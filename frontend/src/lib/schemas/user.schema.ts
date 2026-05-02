import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
  initialPassword: z.string().min(8).optional()
});

export type UserFormValues = z.infer<typeof userSchema>;

