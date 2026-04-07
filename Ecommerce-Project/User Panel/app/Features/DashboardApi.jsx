// Features/DashboardApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const DashboardApi = createApi({
  reducerPath: "DashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardCounts: builder.query({
      query: () => "/Dashboard",
      providesTags: ["Dashboard"],
    }),
    getHotDashboardItems: builder.query({
      query: (limit = 3) => `/DashboardComponent?limit=${limit}`,
      providesTags: ["Dashboard"],
    }),
       invalidatesTags: ["Dashboard"], 
  }),
});

export const {
  useGetDashboardCountsQuery,
  useGetHotDashboardItemsQuery,
} = DashboardApi;