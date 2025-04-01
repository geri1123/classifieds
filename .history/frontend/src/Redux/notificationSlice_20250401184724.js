// notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import io from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1000";

// Socket connection
let socket;

// Async thunk for fetching notification count
export const fetchNotificationCount = createAsyncThunk(
  "notifications/fetchCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/notifications/count`, {
        withCredentials: true
      });
      return response.data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch notification count");
    }
  }
);

// Async thunk for fetching all notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/notifications?page=${params.page}&limit=${params.limit}`, 
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch notifications");
    }
  }
);

// Async thunk for marking a notification as read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/notifications/${notificationId}/read`, 
        {}, 
        { withCredentials: true }
      );
      return response.data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to mark notification as read");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    unreadCount: 0,
    notifications: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0
    },
    isLoading: false,
    error: null,
    socketConnected: false
  },
  reducers: {
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchNotificationCount
      .addCase(fetchNotificationCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchNotificationCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle markNotificationAsRead
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  }
});

// Export actions
export const { updateUnreadCount, setSocketConnected } = notificationSlice.actions;

// Socket middleware factory function
export const setupNotificationSocket = (userId) => (dispatch) => {
  if (!socket) {
    socket = io(BACKEND_URL);
    
    socket.on('connect', () => {
      dispatch(setSocketConnected(true));
      
      // Join user's room
      if (userId) {
        socket.emit('joinRoom', userId);
      }
      
      // Listen for notification count updates
      socket.on('notificationCount', (count) => {
        dispatch(updateUnreadCount(count));
      });
    });
    
    socket.on('disconnect', () => {
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

export default notificationSlice.reducer;