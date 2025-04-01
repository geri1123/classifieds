// notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],    // Store the list of notifications
  unreadCount: 0,       // Store the unread notification count
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);  // Add new notification at the top
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;  // Increment unread notification count
    },
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) state.unreadCount -= 1;  // Decrement unread notification count
    },
  },
});

// Actions
export const {
  setNotifications,
  addNotification,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
} = notificationSlice.actions;

// Reducer
export default notificationSlice.reducer;
