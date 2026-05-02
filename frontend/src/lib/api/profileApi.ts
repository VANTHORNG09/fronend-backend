import { baseApi } from "./baseApi";
import type { User } from "@/types";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<User, void>({
      query: () => "/profile",
      providesTags: ["Profile"]
    }),
    updateProfile: build.mutation<User, Partial<User>>({
      query: (body) => ({ url: "/profile", method: "PUT", body }),
      invalidatesTags: ["Profile", "Auth"]
    }),
    changePassword: build.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: "/profile/change-password", method: "PUT", body })
    }),
    enable2fa: build.mutation<{ user: User; qrCodeUrl: string }, void>({
      query: () => ({ url: "/profile/enable-2fa", method: "POST" }),
      invalidatesTags: ["Profile"]
    }),
    disable2fa: build.mutation<User, void>({
      query: () => ({ url: "/profile/disable-2fa", method: "POST" }),
      invalidatesTags: ["Profile"]
    })
  })
});

export const { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation, useEnable2faMutation, useDisable2faMutation } = profileApi;

