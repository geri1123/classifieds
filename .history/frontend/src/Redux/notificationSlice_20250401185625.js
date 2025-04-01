import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import io from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";

// Socket connection
let socket;

// Async thunk for fetching notification count - no need for userId parameter
export const fetchNotificationCount = createAsyncThunk(
  "notifications/fetchCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/notifications/count`, {
        withCredentials: true  // This sends the cookies with the request
      });
      return response.data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch notification count");
    }
  }
);

// Rest of thunks follow same pattern - they don't need userId parameter

// Socket middleware factory function
export const setupNotificationSocket = () => (dispatch) => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      withCredentials: true // This sends cookies with socket connection
    });
    
    socket.on('connect', () => {
      dispatch(setSocketConnected(true));
      
      // No need to manually join a room - the server can do this based on the cookie
      
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