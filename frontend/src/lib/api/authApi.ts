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
      invalidatesTags: ["Auth"],
    }),
    // 👇 ADD THIS EXACTLY
    register: build.mutation<LoginResponse, { name: string; email: string; password: string; role?: "student" | "teacher" }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      invalidatesTags: ["Auth", "Users"],
    }),
    me: build.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    logout: build.mutation<void, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/logout", method: "POST", body }),
    }),
  }),
  overrideExisting: false,
});

// 👇 MUST INCLUDE useRegisterMutation
export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;