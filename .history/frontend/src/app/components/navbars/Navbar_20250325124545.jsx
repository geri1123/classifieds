"use client"
import { FiShoppingCart, FiUser, FiMenu } from "react-icons/fi";
import Button from "@/components/ui/buttons/Button";
import useDropdown from "@/hooks/dropdowns/useDropdown";
import Login from "@/auth/login/login";

export default function Navbar() {
  const { isOpen: isLoginOpen, isClosing: isLoginClosing, toggleDropdown: toggleLoginDropdown, closeDropdown: closeLoginDropdown, dropdownRef: loginDropdownRef } = useDropdown(); 
  const { isOpen: isSidebarOpen, isClosing: isSidebarClosing, toggleDropdown: toggleSidebarDropdown, closeDropdown: closeSidebardropdown, dropdownRef: sidebarDropdownRef } = useDropdown(); 
  
  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-full px-20 mx-auto">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="text-2xl font-bold text-black">BestMarkets</div>

            {/* Search Bar */}
            <div className="flex-1 mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="I'm looking for..."
                  className="w-full border-2 border-yellow-40 rounded-md pl-4 pr-16 py-2 focus:outline-none focus:border-yellow-500 focus:ring-0"
                />
                <button className="absolute right-1 top-1 bottom-1 bg-yellow-40 hover:bg-yellow-300 text-black px-4 rounded-md">
                  Search
                </button>
              </div>
            </div>

            {/* Cart and User Icons */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm">
                <FiShoppingCart className="w-6 h-6 text-black" />
              </div>
              <FiUser onClick={toggleLoginDropdown} className="w-6 h-6 text-black" />
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center border-t py-3">
            {/* All Categories Button (Yellow) */}
            <button className="flex items-center bg-yellow-40 hover:bg-yellow-300 text-black px-4 py-2 rounded-md font-medium">
              <FiMenu className="mr-2" />
              All Categories
            </button>

            {/* Nav Links */}
            <div className="flex space-x-6 ml-4 text-gray-700 font-medium">
              <a href="#" className="bg-gray-200 px-3 py-1 rounded-md">Home</a>
              <a href="#" className="py-1 rounded-md">Property</a>
              <a href="#" className="py-1 rounded-md">Jobs</a>
              <a href="#" className="py-1 rounded-md">For Sale</a>
              <a href="#" className="py-1 rounded-md">Services</a>
              <a href="#" className="py-1 rounded-md">Events</a>
            </div>

            {/* Post an Ad Button */}
            <button className="ml-auto border-2 border-yellow-40 text-black px-4 py-2 rounded-md font-medium">
              Post an Ad
            </button>
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
      </nav>

      {/* Login Modal Overlay */}
     
    </>
  );
}
