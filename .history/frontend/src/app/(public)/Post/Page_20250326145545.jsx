"use client";

import { useUser } from "@/Context/UserContext";

export default function Page() {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="text-center max-w-3xl bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800">You must be logged in to create a post.</h1>
          <p className="text-lg mb-4 text-gray-600">
            To create a post, please log in or sign up. You can post a variety of ads including:
          </p>
          
          <ul className="text-left mb-6 space-y-2 text-gray-700 list-disc list-inside">
            <li>- <strong>Services:</strong> Offer services such as tutoring, design work, and more.</li>
            <li>- <strong>Jobs:</strong> Post job openings or opportunities in various fields.</li>
            <li>- <strong>Property:</strong> Advertise properties for rent or sale.</li>
            <li>- <strong>For Sale:</strong> Sell your products, goods, or items online.</li>
            <li>- <strong>Events:</strong> Promote upcoming events, workshops, and gatherings.</li>
          </ul>

          <p className="text-lg mb-6 text-gray-600">
            Please log in or sign up to start posting your ads. It’s quick and easy!
          </p>

          {/* Action buttons */}
          <div className="space-x-4">
            <button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out">
              <a href="/login">Log In</a>
            </button>
            <button className="mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out">
              <a href="/signup">Sign Up</a>
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-500">Log in</a> to start posting.
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
