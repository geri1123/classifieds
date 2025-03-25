"use client"
import React, { useState } from "react";
import { PiUser } from "react-icons/pi";
import { MdLockOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import Button from "@/components/ui/buttons/Button";

const Login = ({ closeDropdown }) => {
  const [userData, setUserData] = useState({
    identifier: "",
    user_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
  
    try {
      const response = await axios.post("/api/login", userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Ensure cookies are sent
      });
  
      if (response.data.success) {
        alert("Login successful!");
        window.location.href = "/";
      } else {
        setError(response.data.errors || "Login failed. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.errors || "An error occurred. Please try again.");
    }
  
    setLoading(false);
  };

  return (
    <div className="flex  flex-col relative justify-center rounded-lg items-center">
      <div
        onClick={closeDropdown}
        className="cursor-pointer bg-gray-100 top-7 right-7 absolute flex items-center justify-center rounded-full h-10 w-10"
      >
        <RxCross2 className="dark:text-black" />
      </div>
      <div className="bg-white px-8 py-10 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 mb-3 py-3 rounded relative mt-2"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-600 mb-2">
              Email or Username
            </label>
            <div className="flex items-center border rounded-lg border-gray-300 pl-3 py-1">
              <PiUser className="text-gray-500 w-5 h-5" />
              <input
                type="text"
                name="identifier"
                id="identifier"
                placeholder="Email or username"
                value={userData.identifier}
                onChange={onChange}
                className="w-full dark:text-black pl-2 border-none  focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="user_password" className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <div className="flex items-center border rounded-lg border-gray-300 pl-3 py-1">
              <MdLockOutline className="text-gray-500 w-5 h-5" />
              <input
                type="password"
                name="user_password"
                id="user_password"
                placeholder="Password"
                value={userData.user_password}
                onChange={onChange}
                className="w-full dark:text-black pl-2 border-none  focus:ring-0 focus:outline-none"
              />
            </div>
         
          </div>
          <div className="mb-4 w-full flex items-center justify-center">
            <p className="text-sm text-gray-600">
            Forgot your password?{" "}
            <a href="/auth/forgot-password"
              // onClick={handleForgotPassword}
              className="text-blue-600 hover:text-blue-700 hover:border-b-1 border-blue-600  font-semibold"
            >
              Reset here
            </a>
          </p>
          </div>
            <Button loading={loading}>
                Login

            </Button>
          {/* <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Logging in..." : "Login"}
          </button> */}
        </form>

        <div className="mt-4 text-center">
        
          <p className="text-sm text-gray-600 mt-2">
            Don't have an account?{" "}
            <a 
              href="/SignUp"
              className="text-blue-600 hover:text-blue-700  hover:border-b-1 border-blue-600 font-semibold"
            >
              Register here
            </a>
          </p>
        </div>

        <div className="flex items-center my-4">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-3 text-gray-600 text-sm whitespace-nowrap">Or register with</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <div className="mt-4 flex w-full text-center">
          <button
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google`}
            className="w-full py-2 flex justify-center items-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none "
          >
            <FcGoogle className="h-6 w-6 mr-2" />
            <span className="text-gray-700 text-sm">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;