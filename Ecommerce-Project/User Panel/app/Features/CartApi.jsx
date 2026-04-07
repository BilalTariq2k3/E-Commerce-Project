import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
 tagTypes: ["Cart","Dashboard"],

  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    // ✅ Clear Entire Cart
    clearCart: builder.mutation({
      query: () => ({ url: "/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart","Dashboard"],
    }),

    // ✅ Delete Single Cart Item
    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Update Cart Item Quantity
    updateCartItem: builder.mutation({
      query: ({ id, quantity, totalprice }) => ({
        url: `/cart/${id}`,
        method: "PUT",
        body: { quantity, totalprice },
      }),
     invalidatesTags: ["Cart"],
    }),

    // ✅ Create Order
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Update Products
    updateProducts: builder.mutation({
      query: (data) => ({
        url: "/product",
        method: "PUT",
        body: data,
      }),
     invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useClearCartMutation,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
  useCreateOrderMutation,
  useUpdateProductsMutation,
  useAddToCartMutation,
} = cartApi;
