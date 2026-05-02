import { z } from "zod";

export const assignmentSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().optional(),
  dueDate: z.string().min(1),
  publishDate: z.string().optional(),
  maxPoints: z.coerce.number().positive(),
  type: z.enum(["FILE_UPLOAD", "TEXT_ENTRY", "QUIZ"]),
  allowLate: z.boolean().default(true),
  latePenaltyPerDay: z.coerce.number().min(0).default(0),
  rubric: z.string().optional(),
  draft: z.boolean().default(true)
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;

