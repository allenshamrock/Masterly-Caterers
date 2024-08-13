import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: [],
    username: null,
    role: null,
    accessToken: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { username, user, role, accessToken, id} = action.payload;
      state.isLoggedIn = true;
      state.username = username;
      state.user = user;
      state.accessToken = accessToken;
      state.id = id;
      state.role = role;
    },
    logout: (state, action) => {
      state.username = null;
      state.accessToken = null;
      state.id = null;
      state.role = null;
      state.user = null;
      state.isLoggedIn = false; 
    },
  },
});

export const { setCredentials, logout } = AuthSlice.actions;
export default AuthSlice.reducer;

export const selectCurrentUser = (state) => state?.auth?.username; // Export the current user information after login
export const selectCurrentToken = (state) => state?.auth?.accessToken; // Export the current user access token after login
export const selectCurrentIsRole = (state) => state?.auth?.user?.role;
export const selectUserData = (state) => state?.auth?.user;
