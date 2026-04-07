import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CategoryApi = createApi({
  reducerPath: "CategoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Categories","Products"],
  endpoints: (builder) => ({
    // GET all categories
    getCategories: builder.query({
      query: () => "category",
      providesTags: ["Categories"],
      transformResponse: (response) => response.data || [],
    }),

    // GET single category by ID
    getSingleCategory: builder.query({
      query: (id) => `singleCategory/${id}`,
      transformResponse: (response) => response.data || null,
      providesTags: (result, error, id) => [{ type: "Categories", id }],
    }),

    // POST (add new category)
    addCategory: builder.mutation({
      query: (categoryData) => ({
        url: "category",
        method: "POST",
        body: categoryData, // FormData with name, description, image
      }),
      invalidatesTags: ["Categories"],
    }),

    // PUT (update category by ID)
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `singleCategory/${id}`,
        method: "PUT",
        body: formData, // FormData with updated fields
      }),
      invalidatesTags: ["Categories"],
    }),

    // DELETE category by ID
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `singleCategory/${id}`,
        method: "DELETE",
      }),
       invalidatesTags: ["Categories", "Products"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetSingleCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = CategoryApi;