import { baseApi } from "./baseApi";
import type { User } from "@/types";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: User;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Auth"]
    }),
    me: build.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"]
    }),
    logout: build.mutation<void, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/logout", method: "POST", body })
    })
  })
});

export const { useLoginMutation, useMeQuery, useLogoutMutation } = authApi;

