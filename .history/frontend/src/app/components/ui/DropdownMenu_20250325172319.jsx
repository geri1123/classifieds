"use client"
import { useRouter } from "next/navigation";
import React from 'react';
// import { useUser } from '@/context/UserContext';
import { userSettings } from '@/constants/userSettings';
import useDropdown from '@/hooks/dropdowns/useDropdown';


const DropdownMenu = ({ align , user }) => {
  
  const { isOpen, isClosing, toggleDropdown, closeDropdown, dropdownRef } = useDropdown(); 
//   const { user, setUser } = useUser();
  const router = useRouter();

 

  const createdAt = user?.created_at;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'N/A';

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown} 
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
      >
        <img
          className="w-8 h-8 rounded-full"
          src={user?.profile_img ? user?.profile_img : "/images/nprf.jpg"}
          alt="User"
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            {user?.username || 'User'}
          </span>
          <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu (Visible only if isOpen is true) */}
      {isOpen && (
        <div
          className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'} `}
        >
          {/* User Info */}
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100">{user?.email}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">{`Registered: ${formattedDate}`}</div>
          </div>

          {/* Menu Items */}
          <ul>
            {userSettings.map((e, i) => (
              <li key={i}>
                <a
                  href={`/MyPortal/${e.path}`}
                  className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                >
                  <div className="flex items-center gap-2 justify-center">
                    {e.icon} {e.element}
                  </div>
                </a>
              </li>
            ))}
            {/* Sign Out */}
            <li>
              <a
                href=""
                // onClick={async () => {
                  
                //     await logoutUser(); 
                //   }}
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
              >
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
