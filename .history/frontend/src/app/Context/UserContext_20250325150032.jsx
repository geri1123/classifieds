"use client";

import { createContext, useState, useEffect, useContext, useCallback } from "react";
import useSWR from "swr";

// Create Context
const UserContext = createContext();

const fetcher = async (url) => {
  const res = await fetch(url, { method: "GET", credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export const UserProvider = ({ children }) => {
  const { data, error, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-info`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set authentication status
  useEffect(() => {
    if (data?.success) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [data]);

  
  const refreshUser = useCallback(() => {
    mutate();
  }, [mutate]);

  // Logout function
  const logoutUser = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      mutate(null, false); // Clear user data instantly
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user: data?.user, loading, mutate, isAuthenticated, refreshUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = () => useContext(UserContext);