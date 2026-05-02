import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  unreadCount: number;
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { unreadCount: 0 } as NotificationState,
  reducers: {
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    }
  }
});

export const { setUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;

