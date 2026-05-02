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
    copyClass: build.mutation<LmsClass, string>({
      query: (id) => ({ url: `/classes/${id}/copy`, method: "POST" }),
      invalidatesTags: ["Classes"]
    })
  })
});

export const { useGetClassesQuery, useGetClassQuery, useCreateClassMutation, useUpdateClassMutation, useGetClassStudentsQuery, useCopyClassMutation } = classApi;

