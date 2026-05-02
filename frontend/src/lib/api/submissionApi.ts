import { baseApi } from "./baseApi";
import type { Page, Submission } from "@/types";

export const submissionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSubmissions: build.query<Page<Submission>, { assignmentId?: string; studentId?: string; page?: number }>({
      query: (params) => ({ url: "/submissions", params }),
      providesTags: ["Submissions"]
    }),
    getSubmission: build.query<Submission, string>({
      query: (id) => `/submissions/${id}`,
      providesTags: ["Submissions"]
    }),
    submitAssignment: build.mutation<Submission, { assignmentId: string; contentText?: string; fileUrls?: string }>({
      query: ({ assignmentId, ...body }) => ({ url: `/assignments/${assignmentId}/submit`, method: "POST", body }),
      invalidatesTags: ["Submissions", "Assignments", "Dashboard"]
    }),
    gradeSubmission: build.mutation<Submission, { id: string; grade: number; feedback?: string; draft: boolean }>({
      query: ({ id, ...body }) => ({ url: `/submissions/${id}/grade`, method: "PUT", body }),
      invalidatesTags: ["Submissions", "Dashboard"]
    }),
    releaseSubmission: build.mutation<Submission, string>({
      query: (id) => ({ url: `/submissions/${id}/release`, method: "POST" }),
      invalidatesTags: ["Submissions"]
    }),
    appealSubmission: build.mutation<Submission, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `/submissions/${id}/appeal`, method: "POST", body: { reason } }),
      invalidatesTags: ["Submissions"]
    })
  })
});

export const { useGetSubmissionsQuery, useGetSubmissionQuery, useSubmitAssignmentMutation, useGradeSubmissionMutation, useReleaseSubmissionMutation, useAppealSubmissionMutation } = submissionApi;

