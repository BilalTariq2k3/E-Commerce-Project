// services/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Replace with your backend base URL
const BASE_URL = "http://localhost:3000/api"; 

export const DashboardComponentApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getProductsAndCategories: builder.query({
      query: (limit) => {
        // Attach limit as a search param if provided
        return `/your-endpoint?${limit ? `limit=${limit}` : ""}`;
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetProductsAndCategoriesQuery } = DashboardComponentApi;