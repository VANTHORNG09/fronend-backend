"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/lib/store/store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  }
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: rawBaseQuery,
  tagTypes: ["Auth", "Users", "Classes", "Assignments", "Submissions", "Profile", "Notifications", "Dashboard"],
  endpoints: () => ({})
});

