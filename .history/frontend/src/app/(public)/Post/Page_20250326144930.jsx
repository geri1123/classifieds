"use client";

import { useUser } from "@/Context/UserContext";

export default function Page() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-center">
          <h1>You must be logged in to create a post.</h1>
          <p>Please log in or sign up to create an ad.</p>
          {/* You can link to the login or signup page */}
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
            <a href="/login">Log In</a>
          </button>
          <p className="mt-2">
            Or{" "}
            <a href="/signup" className="text-blue-600">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Post an Ad</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
      {/* Your Post input form goes here */}
      <form>
        <input
          type="text"
          placeholder="Title"
          className="border-2 border-gray-300 p-2 rounded-md mb-4"
        />
        <textarea
          placeholder="Description"
          className="border-2 border-gray-300 p-2 rounded-md mb-4"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
          Submit
        </button>
      </form>
    </div>
  );
}
