import { configureStore, createSlice } from "@reduxjs/toolkit";
import { LoginApi } from "./app/LoginApi";
import { useDispatch, useSelector } from "react-redux";

// Define a type for the slice state
interface AppState {
  token: string;
}

// Define the initial state using that type
const initialState: AppState = {
  token: "",
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setToken } = appSlice.actions;

export const store = configureStore({
  reducer: {
    [LoginApi.reducerPath]: LoginApi.reducer,
    app: appSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(LoginApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()