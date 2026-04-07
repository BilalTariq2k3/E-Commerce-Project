import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserApi = createApi({
  reducerPath: "UserApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
  }),

  tagTypes: ["User"], // ✅ required for cache invalidation

  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "user",
      providesTags: ["User"], // ✅ allows refetch when updated
    }),

    createPosts: builder.mutation({
      query: (newPost) => ({
        url: "user", // no id in URL
        method: "PUT", // update request
        body: newPost, // id should be inside body if needed
      }),
      invalidatesTags: ["User"], // ✅ refetch getPosts automatically
    }),
  }),
});

export const { useGetPostsQuery, useCreatePostsMutation } = UserApi;