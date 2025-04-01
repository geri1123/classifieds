
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import io from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";

// Make socket available outside the thunk
let socket = null;

// Initial state for notifications
const initialState = {
  unreadCount: 0,
  notifications: [],
  socketConnected: false,
  loading: false,
  error: null,
};

Async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/notifications`, {
        withCredentials: true,
      });
      return response.data.notifications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch notifications");
    }
  }
);

// Async thunk for fetching notification count
export const fetchNotificationCount = createAsyncThunk(
  "notifications/fetchCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/notifications/count`, {
        withCredentials: true,
      });
      return response.data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch notification count");
    }
  }
);
export const markAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (notificationId, { rejectWithValue, dispatch }) => {
      try {
        const response = await axios.put(
          `${BACKEND_URL}/api/notifications/${notificationId}/read`,
          {},
          { withCredentials: true }
        );
  
        // Fetch updated notification count after marking as read
        dispatch(fetchNotificationCount());
  
        return notificationId; // Returning ID to update state
      } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Failed to mark notification as read");
      }
    }
  );
// In fetchNotifications thunk

// Improved socket connection setup
export const setupNotificationSocket = () => (dispatch) => {
  // Check if we already have a socket and it's connected
  if (socket && socket.connected) {
    console.log("Socket already connected");
    return () => {}; // Return empty cleanup if already connected
  }
  
  // Close any existing socket
  if (socket) {
    socket.disconnect();
  }
  
  console.log("Setting up new socket connection");
  socket = io(BACKEND_URL, {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10
  });

  socket.on("connect", () => {
    console.log("Socket connected successfully");
    dispatch(setSocketConnected(true));
  });

  // Listen for notification count updates
  socket.on("notificationCount", (count) => {
    console.log("Received updated count:", count);
    dispatch(updateUnreadCount(count));
  });
  
  // Listen for new notifications
  socket.on("newNotification", (notification) => {
    console.log("Received new notification:", notification);
    dispatch(addNotification(notification));
    dispatch(incrementUnreadCount());
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    dispatch(setSocketConnected(false));
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // Return cleanup function
  return () => {
    if (socket) {
      console.log("Cleaning up socket connection");
      socket.disconnect();
      socket = null;
    }
  };
};

// Notification slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
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
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNotificationCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchNotificationCount.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        // Mark notification as read in the state
        state.notifications = state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        );
  
        // Decrement unread count (optional, since fetchNotificationCount runs)
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });
      ;
  },
});

export const {
  setNotifications,
  addNotification,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  setSocketConnected,
  updateUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;