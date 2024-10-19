import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IScore {
  time1: Array<number | string>;
  time2: Array<number | string>;
  time3: Array<number | string>;
  time4: Array<number | string>;
  time5: Array<number | string>;
  time6: Array<number | string>;
  time7: Array<number | string>;
  time8: Array<number | string>;
  time9: Array<number | string>;
  time10: Array<number | string>;
  time11: Array<number | string>;
  time12: Array<number | string>;
}
export interface IPlayerScore {
  competitionId: string;
  comPlayerId: string;
  playerId: string;
  scores: IScore;
}

export const LoginApi = createApi({
  reducerPath: "LoginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://archive-xxzvcg2hrq-de.a.run.app/v1/mobile",
  }),
  tagTypes: ["Player"],
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
      providesTags: ["Player"],
    }),
    chamDiem: builder.mutation({
      query: ({
        scores,
        playerId,
        id,
        token,
      }: {
        scores: IScore;
        id: number;
        playerId: number;
        token: string;
      }) => ({
        url: `players/${id}`,
        method: "PUT",
        body: {
          playerId: playerId,
          scores: scores,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Player"],
    }),
  }),
});

export const { useLoginMutation, usePlayersQuery, useChamDiemMutation } =
  LoginApi;
