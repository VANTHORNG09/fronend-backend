import { baseApi } from "./baseApi";
import type { NotificationItem } from "@/types";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<NotificationItem[], void>({
      query: () => "/notifications",
      providesTags: ["Notifications"]
    }),
    markNotificationRead: build.mutation<NotificationItem, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["Notifications"]
    })
  })
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation } = notificationApi;
