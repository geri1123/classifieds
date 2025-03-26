"use client";

import { useUser } from "@/Context/UserContext";
import useDropdown from "@/hooks/dropdowns/useDropdown";
import Login from "@/auth/login/login";
export default function Page() {
  const { isAuthenticated } = useUser();
    const { isOpen: isLoginOpen, isClosing: isLoginClosing, toggleDropdown: toggleLoginDropdown, closeDropdown: closeLoginDropdown, dropdownRef: loginDropdownRef } = useDropdown(); 
  
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
            <button onClick={toggleLoginDropdown} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out">
             Log In
            </button>
            <button className="mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out">
              <a href="/Signup">Sign Up</a>
            </button>
          </div>
          <div className="mt-6 text-sm text-gray-600">
  Already have an account?{" "}
  <span
    onClick={toggleLoginDropdown}
    className="text-blue-600 hover:text-blue-500 cursor-pointer"
  >
    Log in
  </span>{" "}
  to start posting.
</div>

        </div>
        {isLoginOpen && (
        <div
          className={`fixed z-50 top-0 left-0 w-full h-screen bg-gray-950 bg-opacity-70 flex justify-center items-center transition-all duration-500 ${isLoginClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        >
          <div
            ref={loginDropdownRef}
            className={`before:absolute before:inset-0 before:backdrop-blur-md 
              before:bg-white/90 dark:before:bg-gray-800/90 before:-z-10 z-30 mt-20 mb-20 shadow-lg ${isLoginClosing ? 'animate-closeModal' : 'animate-openModal'}`}
          >
            <Login closeDropdown={closeLoginDropdown} />
          </div>
        </div>
      )}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
    =
    </div>
  );
}
