//src/redux/store.ts

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "@/redux/slices/userSlice"
import themeReducer from "@/redux/slices/themeSlice";
import uiReducer from "@/redux/slices/uiSlice"
import permissionSlice from "./slices/permissionSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    theme:themeReducer,
    ui:uiReducer,
    permissions: permissionSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;