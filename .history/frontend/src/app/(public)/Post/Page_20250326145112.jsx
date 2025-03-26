"use client";

import { useUser } from "@/Context/UserContext";

export default function Page() {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">You must be logged in to create a post.</h1>
          <p className="mb-4">To create a post, please log in or sign up. You can post a variety of ads including:</p>
          
          <ul className="text-left mb-6">
            <li>- <strong>Services:</strong> Offer services such as tutoring, design work, etc.</li>
            <li>- <strong>Jobs:</strong> Post job openings or job opportunities.</li>
            <li>- <strong>Property:</strong> Advertise properties for rent or sale.</li>
            <li>- <strong>For Sale:</strong> Sell your products or goods online.</li>
            <li>- <strong>Events:</strong> Promote upcoming events, parties, or gatherings.</li>
          </ul>

          <p className="mb-4">Please log in or sign up to start posting your ads.</p>

          {/* You can link to the login or signup page */}
          <div className="space-x-4">
            <button className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-md">
              <a href="/login">Log In</a>
            </button>
            <button className="mt-4 bg-green-500 text-white px-6 py-3 rounded-md">
              <a href="/signup">Sign Up</a>
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-600">Log in</a> to start posting.
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
