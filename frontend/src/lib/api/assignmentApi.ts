import { baseApi } from "./baseApi";
import type { Assignment, Page } from "@/types";

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAssignments: build.query<Page<Assignment>, { classId?: string; search?: string; page?: number }>({
      query: (params) => ({ url: "/assignments", params }),
      providesTags: ["Assignments"]
    }),
    getAssignment: build.query<Assignment, string>({
      query: (id) => `/assignments/${id}`,
      providesTags: ["Assignments"]
    }),
    createAssignment: build.mutation<Assignment, Partial<Assignment>>({
      query: (body) => ({ url: "/assignments", method: "POST", body }),
      invalidatesTags: ["Assignments", "Dashboard"]
    }),
    updateAssignment: build.mutation<Assignment, { id: string; body: Partial<Assignment> }>({
      query: ({ id, body }) => ({ url: `/assignments/${id}`, method: "PUT", body }),
      invalidatesTags: ["Assignments", "Dashboard"]
    }),
    deleteAssignment: build.mutation<void, string>({
      query: (id) => ({ url: `/assignments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Assignments", "Dashboard"]
    }),
    publishAssignment: build.mutation<Assignment, string>({
      query: (id) => ({ url: `/assignments/${id}/publish`, method: "POST" }),
      invalidatesTags: ["Assignments"]
    })
  })
});

export const { useGetAssignmentsQuery, useGetAssignmentQuery, useCreateAssignmentMutation, useUpdateAssignmentMutation, useDeleteAssignmentMutation, usePublishAssignmentMutation } = assignmentApi;
