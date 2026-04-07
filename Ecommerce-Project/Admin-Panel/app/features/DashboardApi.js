import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const DashboardApi = createApi({
  reducerPath: "DashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "dashboard",
      providesTags: ["Dashboard"],
      transformResponse: (response) =>
        response.data || {
          totalUsers: 0,
          totalOrders: 0,
          totalCategories: 0,
          totalProducts: 0,
        },
    }),
  }),
});

export const { useGetDashboardStatsQuery } = DashboardApi;
