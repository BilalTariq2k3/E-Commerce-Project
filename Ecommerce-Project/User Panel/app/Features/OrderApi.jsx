// services/orderApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    // Fetch all orders for the user
    getOrders: builder.query({
      query: () => `/order`,
      providesTags: ["Orders"],
    }),
    // Fetch a single order by id
    getOrderById: builder.query({
      query: (id) => `/OrderCardDetails/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    // Create a new order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),
    // Submit product rating
    submitRating: builder.mutation({
      query: ({ orderId, productId, rating, review }) => ({
        url: `/ProductRating/${orderId}`,
        method: "PUT",
        body: { productId, rating, review },
      }),
      invalidatesTags: ["Orders"], // update orders cache
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useSubmitRatingMutation, // ✅ new mutation hook
} = orderApi;
