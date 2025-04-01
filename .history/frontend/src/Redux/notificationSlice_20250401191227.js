import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import io from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";

// Initial state for notifications
const initialState = {
  unreadCount: 0,
  notifications: [],
  socketConnected: false,
  loading: false,
  error: null,
};

// Async thunk for fetching notification count
export const fetchNotificationCount = createAsyncThunk(
  "notifications/fetchCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/notifications/count`, {
        withCredentials: true, // This sends the cookies with the request
      });
      return response.data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch notification count");
    }
  }
);

// Socket connection setup
let socket;

// Async thunk for setting up the socket connection
export const setupNotificationSocket = () => (dispatch) => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      withCredentials: true, // This sends cookies with socket connection
    });

    socket.on("connect", () => {
      dispatch(setSocketConnected(true));

      // Listen for notification count updates
      socket.on("notificationCount", (count) => {
        dispatch(updateUnreadCount(count));
      });
    });

    socket.on("disconnect", () => {
      dispatch(setSocketConnected(false));
    });
  }

  return () => {
    if (socket) {
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
      state.notifications.unshift(action.payload); // Add new notification at the top
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) state.unreadCount -= 1;
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchNotificationCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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
