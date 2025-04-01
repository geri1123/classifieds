"use client"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "@redux/notificationSlice";
export default function notificationList(){
    const dispatch = useDispatch();
  
    // Get notifications and loading state from Redux
    const { notifications, loading, error } = useSelector((state) => state.notifications);

    return(
        <div>
        <h1>Notifications</h1>
  
        {/* Show loading state */}
        {loading && <p>Loading notifications...</p>}
  
        {/* Show error if exists */}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
  
        {/* Show notifications */}
        <ul>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li key={index}>
                <strong>{notification.title}</strong>: {notification.message}
              </li>
            ))
          ) : (
            <p>No notifications found.</p>
          )}
        </ul>
      </div>
    )
}