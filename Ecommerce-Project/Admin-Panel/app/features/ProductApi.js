import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ProductApi = createApi({
  reducerPath: "ProductApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    // GET all products
    getProducts: builder.query({
      query: () => "product",
      providesTags: ["Products"],
      transformResponse: (response) => ({
        products: response.data || [],
        categories: response.categories || [],
      }),
    }),

    // GET single product
    getSingleProduct: builder.query({
      query: (id) => `singleProduct/${id}`,
      transformResponse: (response) => response.data || null,
    }),

    // POST
    addProduct: builder.mutation({
      query: (productData) => ({
        url: "product",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ PUT (UPDATE)
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `singleProduct/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    // DELETE
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `singleProduct/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductApi;
