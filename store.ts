import { configureStore } from "@reduxjs/toolkit";
import { LoginApi } from "./app/LoginApi";

export const store = configureStore({
  reducer: {
    [LoginApi.reducerPath]: LoginApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(LoginApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
