import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "user", // calls /api/user
      providesTags: ["Users"],
      transformResponse: (response) => response.data || [],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `singleUser/${id}`, // calls /api/user/:id
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation } = UserApi;
