// hooks/useNotifications.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchNotificationCount, 
  fetchNotifications,
  markNotificationAsRead,
  setupNotificationSocket
} from '../store/notificationSlice';

export const useNotifications = (userId) => {
  const dispatch = useDispatch();
  const { 
    unreadCount, 
    notifications, 
    pagination, 
    isLoading, 
    error, 
    socketConnected 
  } = useSelector(state => state.notifications);

  // Initial fetch and socket setup
  useEffect(() => {
    if (userId) {
      dispatch(fetchNotificationCount());
      
      // Setup socket connection
      const cleanup = dispatch(setupNotificationSocket(userId));
      
      // Cleanup socket on component unmount
      return cleanup;
    }
  }, [dispatch, userId]);

  // Function to fetch all notifications with pagination
  const getNotifications = (page = 1, limit = 10) => {
    dispatch(fetchNotifications({ page, limit }));
  };

  // Function to mark a notification as read
  const markAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  return {
    unreadCount,
    notifications,
    pagination,
    isLoading,
    error,
    socketConnected,
    getNotifications,
    markAsRead
  };
};

export default useNotifications;