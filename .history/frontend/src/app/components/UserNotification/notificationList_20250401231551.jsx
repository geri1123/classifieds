// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchNotifications, markAsRead } from "@redux/notificationSlice";
// import { GoBellFill } from "react-icons/go";
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
//           <ul className="divide-y divide-gray-300 dark:divide-gray-700 max-h-[60vh] scrollbar overflow-y-auto">
//             {notifications.map((notification) => (
//               <li
//                 key={notification.id}
//                 onClick={() => handleNotificationClick(notification.id)}
//                 className={`p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 ${
//                   notification.status === "read" ? "opacity-60" : ""
//                 }`}
//               >
//                 <div className="flex gap-3 items-center">
//                  <GoBellFill/> <p className="text-md text-black dark:text-gray-400">
//                     {notification.message}
//                   </p>
//                 </div>
//                 {notification.status === "unread" && (
//                   <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                 )}
//                 {notification.status === "read" && (
//                   <span className="w-2 h-2 bg-green-700 rounded-full"></span>
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

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "@redux/notificationSlice";
import { GoBellFill } from "react-icons/go";
import { formatDistanceToNow } from "date-fns";  // Importing the function from date-fns

export default function NotificationsPage() {
  const dispatch = useDispatch();

  // Get notifications and unread count
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Handle notification click
  const handleNotificationClick = (id) => {
    dispatch(markAsRead(id));
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
          <ul className="divide-y divide-gray-300 dark:divide-gray-700 max-h-[60vh] scrollbar overflow-y-auto">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`p-4 cursor-pointer flex flex-col justify-between items-start hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  notification.status === "read" ? "opacity-60" : ""
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-3 items-center">
                    <GoBellFill />
                    <p className="text-md text-black dark:text-gray-400">{notification.message}</p>
                  </div>

                  {/* Status Indicator (Dot) */}
                  <div className="flex items-center ml-2">
                    {notification.status === "unread" && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                    {notification.status === "read" && (
                      <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    )}
                  </div>
                </div>

                {/* Showing time since notification was created */}
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {notification.created_at &&
                    formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No notifications found.</p>
        )}
      </div>
    </div>
  );
}
