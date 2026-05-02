"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        document.cookie = `accessToken=${action.payload.accessToken}; path=/; max-age=1200; SameSite=Lax`;
        document.cookie = `role=${action.payload.user.role}; path=/; max-age=1200; SameSite=Lax`;
      }
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        document.cookie = "accessToken=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
      }
    }
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

