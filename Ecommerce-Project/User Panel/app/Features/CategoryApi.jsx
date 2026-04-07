// Features/CategoryApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CategoryApi = createApi({
  reducerPath: "CategoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (limit = 8) => `/category?limit=${limit}`,
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery } = CategoryApi;