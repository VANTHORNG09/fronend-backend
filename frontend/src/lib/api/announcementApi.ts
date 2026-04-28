import { baseApi } from "./baseApi";
import type { Announcement } from "@/types";

export const announcementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAnnouncements: build.query<Announcement[], string>({
      query: (classId) => ({ url: "/announcements", params: { classId } }),
      providesTags: ["Classes"]
    }),
    createAnnouncement: build.mutation<Announcement, { classId: string; title: string; message: string }>({
      query: (body) => ({ url: "/announcements", method: "POST", body }),
      invalidatesTags: ["Classes", "Notifications"]
    }),
    updateAnnouncement: build.mutation<Announcement, { id: string; classId: string; title: string; message: string }>({
      query: ({ id, ...body }) => ({ url: `/announcements/${id}`, method: "PUT", body }),
      invalidatesTags: ["Classes"]
    }),
    deleteAnnouncement: build.mutation<void, string>({
      query: (id) => ({ url: `/announcements/${id}`, method: "DELETE" }),
      invalidatesTags: ["Classes"]
    })
  })
});

export const { useGetAnnouncementsQuery, useCreateAnnouncementMutation, useUpdateAnnouncementMutation, useDeleteAnnouncementMutation } = announcementApi;

