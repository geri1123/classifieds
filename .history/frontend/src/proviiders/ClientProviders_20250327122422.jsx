"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";  // Ensure correct import path
import { UserProvider } from "@/context/UserContext"; // Ensure correct path

export default function ClientProviders({ children }) {
    return (
        <UserProvider>
            <Provider store={store}>
                {children}
            </Provider>
        </UserProvider>
    );
}