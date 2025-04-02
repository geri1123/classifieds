"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineMail } from "react-icons/ai";
import { CgDanger } from "react-icons/cg";
import { RiArrowGoBackFill } from "react-icons/ri";
import Button from "@/components/ui/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, expiresAt - now);

      setTimeLeft(remaining);

      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/password/forgot-password`,
        { email }
      );

      setMessage(response.data.message);
      setExpiresAt(response.data.expiresAt);
      setError("");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setMessage("");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col gap-5 justify-center items-center bg-gray-100 px-4">
      <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg py-6 px-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Reset Password</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Enter your email address below, and we’ll send you a link to reset your password.
        </p>

        {error && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md mt-3">
            <CgDanger className="text-red-500" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-2 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-md mt-3">
            ✅ <p className="text-sm">{message}</p>
          </div>
        )}

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="flex items-center border rounded-lg border-gray-300 px-3 py-2 focus-within:border-blue-500 transition">
            <AiOutlineMail className="text-gray-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              aria-label="Email Address"
              className="bg-transparent w-full border-none outline-none px-2 py-1 text-gray-800 dark:text-white"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>

        {timeLeft !== null && (
          <p className="text-gray-500 text-sm mt-3">
            Link expires in: <strong>{formatTime(timeLeft)}</strong>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <RiArrowGoBackFill size={20} className="text-blue-600" />
        <a className="text-blue-800 font-medium hover:underline" href="/">
          Go back home
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;
