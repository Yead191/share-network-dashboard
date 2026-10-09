import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Facility",
    "Package",
    "Review",
    "Profile",
    "Chat-Rooms",
    "Chat-Messages",
    "TimeTracks",
    "Class",
    "Resourse",
    "Assignment",
    "Submission",
    "MentorWoops",
  ],
  endpoints: () => ({}),
});

export const imageUrl = import.meta.env.VITE_IMAGE_URL;
export const socketUrl = import.meta.env.VITE_SOCKET_URL;
