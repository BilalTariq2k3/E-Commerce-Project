import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const NotificationApi = createApi({
  reducerPath: "NotificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => "notification",
      providesTags: ["Notifications"],
      transformResponse: (response) => response.data || [],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `singleNotification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
} = NotificationApi;
