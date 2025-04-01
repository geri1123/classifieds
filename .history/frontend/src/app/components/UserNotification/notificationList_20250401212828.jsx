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
            <h1>Notification List</h1>
        </div>
    )
}