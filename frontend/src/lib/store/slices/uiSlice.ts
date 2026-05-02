import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
}

const uiSlice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: false, theme: "system" } as UiState,
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setThemePreference(state, action: PayloadAction<UiState["theme"]>) {
      state.theme = action.payload;
    }
  }
});

export const { setSidebarOpen, setThemePreference } = uiSlice.actions;
export default uiSlice.reducer;

