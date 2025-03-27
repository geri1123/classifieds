"use client";

import { Provider } from "react-redux";
import { store } from "@redux/store";  // Ensure correct import path

import { UserProvider } from "@/Context/UserContext";
export default function ClientProviders({ children }) {
    return (
        <Provider store={store}>
        <UserProvider>
           
                {children}
            </Provider>
        </UserProvider>
    );
}