// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import io from "socket.io-client";

// const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";

// // Initial state for notifications
// const initialState = {
//   unreadCount: 0,
//   notifications: [],
//   socketConnected: false,
//   loading: false,
//   error: null,
// };

// // Async thunk for fetching notification count
// export const fetchNotifications = createAsyncThunk(
//     "notifications/fetchNotifications",
//     async (_, { rejectWithValue }) => {
//       try {
//         const response = await axios.get(`${BACKEND_URL}/api/notifications`, {
//           withCredentials: true, // Ensure cookies are sent
//         });
//         return response.data.notifications;
//       } catch (error) {
//         return rejectWithValue(error.response?.data?.error || "Failed to fetch notifications");
//       }
//     }
//   );
  
//   // Async thunk for fetching notification count
//   export const fetchNotificationCount = createAsyncThunk(
//     "notifications/fetchCount",
//     async (_, { rejectWithValue }) => {
//       try {
//         const response = await axios.get(`${BACKEND_URL}/api/notifications/count`, {
//           withCredentials: true, // This sends cookies with the request
//         });
//         return response.data.unreadCount;
//       } catch (error) {
//         return rejectWithValue(error.response?.data?.error || "Failed to fetch notification count");
//       }
//     }
//   );

// // Socket connection setup
// let socket;

// // Async thunk for setting up the socket connection
// export const setupNotificationSocket = () => (dispatch) => {
//   if (!socket) {
//     socket = io(BACKEND_URL, {
//       withCredentials: true, // This sends cookies with socket connection
//     });

//     socket.on("connect", () => {
//       dispatch(setSocketConnected(true));

//       // Listen for notification count updates
//       socket.on("notificationCount", (count) => {
//         dispatch(updateUnreadCount(count));
//       });
//     });

//     socket.on("disconnect", () => {
//       dispatch(setSocketConnected(false));
//     });
//   }

//   return () => {
//     if (socket) {
//       socket.disconnect();
//       socket = null;
//     }
//   };
// };

// // Notification slice
// const notificationSlice = createSlice({
//     name: "notifications",
//     initialState,
//     reducers: {
//       setNotifications: (state, action) => {
//         state.notifications = action.payload;
//       },
//       setUnreadCount: (state, action) => {
//         state.unreadCount = action.payload;
//       },
//       // Other reducers...
//     },
//     extraReducers: (builder) => {
//       builder
//         .addCase(fetchNotifications.pending, (state) => {
//           state.loading = true;
//         })
//         .addCase(fetchNotifications.fulfilled, (state, action) => {
//           state.loading = false;
//           state.notifications = action.payload;
//         })
//         .addCase(fetchNotifications.rejected, (state, action) => {
//           state.loading = false;
//           state.error = action.payload;
//         })
//         .addCase(fetchNotificationCount.fulfilled, (state, action) => {
//           state.unreadCount = action.payload;
//         })
//         .addCase(fetchNotificationCount.rejected, (state, action) => {
//           state.error = action.payload;
//         });
//     },
//   });
// export const {
//   setNotifications,
//   addNotification,
//   setUnreadCount,
//   incrementUnreadCount,
//   decrementUnreadCount,
//   setSocketConnected,
//   updateUnreadCount,
// } = notificationSlice.actions;

// export default notificationSlice.reducer;
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

// Async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/notifications`, {
        withCredentials: true, // Ensure cookies are sent
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
        withCredentials: true, // This sends cookies with the request
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
      
      // Listen for new notifications
      socket.on("newNotification", (notification) => {
        dispatch(addNotification(notification));
        // Also update the count or fetch the latest count
        dispatch(incrementUnreadCount());
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