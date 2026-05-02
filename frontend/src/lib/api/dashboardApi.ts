import { baseApi } from "./baseApi";
import type { DashboardResponse } from "@/types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboard: build.query<DashboardResponse, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"]
    })
  })
});

export const { useGetDashboardQuery } = dashboardApi;

