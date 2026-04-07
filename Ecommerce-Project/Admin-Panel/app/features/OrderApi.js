import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const OrderApi = createApi({
  reducerPath: "OrderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "order", // calls /api/user
      providesTags: ["Orders"],
      transformResponse: (response) => response.data || [],
    }),
     getSingleOrder: builder.query({
      query: (id) => `singleOrder/${id}`,
      transformResponse: (response) => response.data || null,
    }),
  
  }),
});

export const { useGetOrdersQuery ,  useGetSingleOrderQuery,} = OrderApi;