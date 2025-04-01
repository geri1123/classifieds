import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

// Connect to Socket.IO server
const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

// Fetch past notifications from the database
export const fetchNotifications = createAsyncThunk("notifications/fetch", async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications`);
  return response.json();
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload); // Add new notifications to the start of the array
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch notifications";
      });
  },
});

// Listen for real-time notifications via Socket.IO
export const initSocketListener = () => (dispatch) => {
  socket.on("notification", (notification) => {
    dispatch(addNotification(notification));
  });
};

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
