import { baseApi } from "./baseApi";
import type { ClassStatus, LmsClass, Page, User } from "@/types";

export const classApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getClasses: build.query<Page<LmsClass>, { teacherId?: string; status?: ClassStatus; search?: string; page?: number }>({
      query: (params) => ({ url: "/classes", params }),
      providesTags: ["Classes"]
    }),
    getClass: build.query<LmsClass, string>({
      query: (id) => `/classes/${id}`,
      providesTags: ["Classes"]
    }),
    createClass: build.mutation<LmsClass, Partial<LmsClass> & { teacherId?: string }>({
      query: (body) => ({ url: "/classes", method: "POST", body }),
      invalidatesTags: ["Classes", "Dashboard"]
    }),
    updateClass: build.mutation<LmsClass, { id: string; body: Partial<LmsClass> }>({
      query: ({ id, body }) => ({ url: `/classes/${id}`, method: "PUT", body }),
      invalidatesTags: ["Classes"]
    }),
    getClassStudents: build.query<User[], string>({
      query: (id) => `/classes/${id}/students`,
      providesTags: ["Classes"]
    }),
    addClassStudents: build.mutation<User[], { classId: string; studentIds: string[] }>({
      query: ({ classId, studentIds }) => ({ url: `/classes/${classId}/students`, method: "POST", body: { studentIds } }),
      invalidatesTags: ["Classes", "Dashboard"]
    }),
    removeClassStudent: build.mutation<void, { classId: string; studentId: string }>({
      query: ({ classId, studentId }) => ({ url: `/classes/${classId}/students/${studentId}`, method: "DELETE" }),
      invalidatesTags: ["Classes", "Dashboard"]
    }),
    assignTeacher: build.mutation<LmsClass, { classId: string; teacherId: string }>({
      query: ({ classId, teacherId }) => ({ url: `/classes/${classId}/teacher`, method: "POST", body: { teacherId } }),
      invalidatesTags: ["Classes"]
    }),
    copyClass: build.mutation<LmsClass, string>({
      query: (id) => ({ url: `/classes/${id}/copy`, method: "POST" }),
      invalidatesTags: ["Classes"]
    }),
    joinClass: build.mutation<LmsClass, { classCode: string }>({
      query: (body) => ({ url: "/classes/join", method: "POST", body }),
      invalidatesTags: ["Classes", "Dashboard"]
    }),
    dropClass: build.mutation<void, string>({
      query: (id) => ({ url: `/classes/${id}/drop`, method: "DELETE" }),
      invalidatesTags: ["Classes", "Dashboard"]
    })
  })
});

export const { useGetClassesQuery, useGetClassQuery, useCreateClassMutation, useUpdateClassMutation, useGetClassStudentsQuery, useAddClassStudentsMutation, useRemoveClassStudentMutation, useAssignTeacherMutation, useCopyClassMutation, useJoinClassMutation, useDropClassMutation } = classApi;
