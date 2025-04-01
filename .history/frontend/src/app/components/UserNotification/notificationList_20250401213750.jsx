"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "@redux/notificationSlice";
import { FiBell } from "react-icons/fi";
export default function NotificationList() {
  const dispatch = useDispatch();
  
  // Get notifications and unread count
  const { notifications, unreadCount, loading, error } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());

    // WebSocket or polling will auto-update notifications in Redux
  }, [dispatch]);

  // Handle notification click
  const handleNotificationClick = (id) => {
    dispatch(markAsRead(id));
  };

  return (
    <div className="relative inline-block text-left">
      {/* Notification Bell */}
      <div className="cursor-pointer relative">
        <FiBell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notification Dropdown */}
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>

        {/* Loading State */}
        {loading && <p className="p-4 text-sm text-gray-500">Loading notifications...</p>}

        {/* Error Handling */}
        {error && <p className="p-4 text-sm text-red-500">Error: {error}</p>}

        {/* Notification List */}
        <ul className="max-h-64 overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-start space-x-3 ${
                  notification.read ? "opacity-50" : "opacity-100"
                }`}
              >
                <div className="flex-grow">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{notification.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                </div>
                {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
              </li>
            ))
          ) : (
            <p className="p-4 text-sm text-gray-500">No notifications found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
