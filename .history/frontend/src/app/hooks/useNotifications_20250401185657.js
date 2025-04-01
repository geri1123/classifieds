// hooks/useNotifications.js (simplified)
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchNotificationCount, 
  fetchNotifications,
  markNotificationAsRead,
  setupNotificationSocket
} from '../store/notificationSlice';

export const useNotifications = () => {
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
    // Fetch the notification count - backend will use the token cookie
    dispatch(fetchNotificationCount());
    
    // Setup socket connection - socket will use cookie
    const cleanup = dispatch(setupNotificationSocket());
    
    // Cleanup socket on component unmount
    return cleanup;
  }, [dispatch]);

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