export type Role = "ADMIN" | "TEACHER" | "STUDENT";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type ClassStatus = "ACTIVE" | "ARCHIVED";
export type AssignmentType = "FILE_UPLOAD" | "TEXT_ENTRY" | "QUIZ";
export type SubmissionStatus = "MISSING" | "SUBMITTED" | "LATE" | "GRADED" | "RETURNED";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt?: string;
  twoFactorEnabled?: boolean;
}

export interface LmsClass {
  id: string;
  name: string;
  description?: string;
  subject?: string;
  teacherId?: string;
  teacherName?: string;
  classCode: string;
  status: ClassStatus;
  schedule?: string;
  startDate?: string;
  endDate?: string;
  studentCount: number;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  className: string;
  title: string;
  description?: string;
  dueDate: string;
  publishDate?: string;
  maxPoints: number;
  type: AssignmentType;
  allowLate: boolean;
  latePenaltyPerDay: number;
  rubric?: string;
  draft: boolean;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  contentText?: string;
  fileUrls?: string;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  status: SubmissionStatus;
  gradedAt?: string;
  released: boolean;
  attemptNumber: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface DashboardResponse {
  stats: Record<string, number>;
  recentActivity: Array<{ id: string; action: string; createdAt: string; ipAddress?: string; device?: string }>;
  charts: Record<string, Array<{ label: string; value: number }>>;
  upcomingDeadlines: Array<Record<string, unknown>>;
  tips: string[];
}

