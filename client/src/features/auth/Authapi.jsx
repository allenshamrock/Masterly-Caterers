import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "./Authslice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:5555",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = getState().auth.accessToken; //Accesstoken when login is successful
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

//Get a new access token when the access token expires
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.originalStatus === 403) {
    console.log("Sending refresh token");

    //Implementing refresh token logic below
    const refreshToken = getState().auth.refreshToken;
    const refreshResult = await baseQuery(
      {
        url: "refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      //Assuming the refreshResult.data has the new access token & refresh token
      api.dispatch(
        setCredentials({
          accesToken: refreshResult.data.accessToken,
          refreshToken: refreshResult.data.refreshToken,
          user,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = apiSlice;
