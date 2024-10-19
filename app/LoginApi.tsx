import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const LoginApi = createApi({
  reducerPath: "LoginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://archive-xxzvcg2hrq-de.a.run.app/v1/mobile",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "sign",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    players: builder.query({
      query: (token: string) => ({
        url: "players",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, usePlayersQuery } = LoginApi;
