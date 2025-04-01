"use client"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "@redux/notificationSlice";
export default function notificationList(){
    return(
        <div>
            <h1>Notification List</h1>
        </div>
    )
}