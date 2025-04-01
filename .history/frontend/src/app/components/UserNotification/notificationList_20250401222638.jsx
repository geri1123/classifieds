// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchNotifications, markAsRead } from "@redux/notificationSlice";

// export default function NotificationsPage() {
//   const dispatch = useDispatch();

//   // Get notifications and unread count
//   const { notifications, loading, error } = useSelector((state) => state.notifications);

//   useEffect(() => {
//     dispatch(fetchNotifications());
//   }, [dispatch]);

//   // Handle notification click
//   const handleNotificationClick = (id) => {
//     dispatch(markAsRead(id));
//   };

//   return (
//     <div className="max-w-2xl mx-auto py-8 px-4">
//       <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
//         Notifications
//       </h1>

//       {/* Loading State */}
//       {loading && <p className="text-gray-500">Loading notifications...</p>}

//       {/* Error Handling */}
//       {error && <p className="text-red-500">Error: {error}</p>}

//       {/* Notification List */}
//       <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
//         {notifications.length > 0 ? (
//           <ul className="divide-y divide-gray-300 dark:divide-gray-700">
//             {notifications.map((notification) => (
//               <li
//                 key={notification.id}
//                 onClick={() => handleNotificationClick(notification.id)}
//                 className={`p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 ${
//                   notification.status === "read" ? "opacity-50" : "opacity-100"
//                 }`}
//               >
//                 <div>
                 
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {notification.message}
//                   </p>
//                 </div>
//                 {notification.status==="unread" && (
//                   <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500 text-center">No notifications found.</p>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "@redux/notificationSlice";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  // Get notifications, loading state, and error
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  // Fetch notifications when the component mounts or page changes
  useEffect(() => {
    dispatch(fetchNotifications({ page }));
  }, [dispatch, page]);

  // Handle notification click to mark as read
  const handleNotificationClick = (id) => {
    dispatch(markAsRead(id));
  };

  // Load more notifications
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Notifications
      </h1>

      {/* Loading State */}
      {loading && <p className="text-gray-500">Loading notifications...</p>}

      {/* Error Handling */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Notification List */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        {notifications.length > 0 ? (
          <ul className="divide-y divide-gray-300 dark:divide-gray-700">
          {notifications.map((notification) => (
  <li
    key={notification.id}  // Ensure notification.id is unique, or use another unique identifier
    onClick={() => handleNotificationClick(notification.id)}
    className={`p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 ${
      notification.status === "read" ? "opacity-50" : "opacity-100"
    }`}
  >
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {notification.message}
      </p>
    </div>
    {notification.status === "unread" && (
      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
    )}
  </li>
))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No notifications found.</p>
        )}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleLoadMore}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
