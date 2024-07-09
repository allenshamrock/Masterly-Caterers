import {configureStore} from '@reduxjs/toolkit'
import AuthReducer from './auth/Authslice'
import { apiSlice } from './auth/Authapi'

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    api: apiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat(apiSlice.middleware),
});