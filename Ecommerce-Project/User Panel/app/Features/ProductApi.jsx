import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ProductApi = createApi({
  reducerPath: "ProductApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),

  tagTypes: ["Product"],

  endpoints: (builder) => ({
 endpoints: (builder) => ({
    getProductById: builder.query({
      query: (id) => `/ProductDetails/${id}`,
    }),
  }),


    getPosts: builder.query({
      query: ({ limit, searchName, minPrice, maxPrice }) => ({
        url: "product",
        params: {
          limit,
          name: searchName || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
        },
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetPostsQuery, } = ProductApi;

































