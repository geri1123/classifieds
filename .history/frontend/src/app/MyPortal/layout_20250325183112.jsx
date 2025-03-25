'use client'
import { useState } from 'react';
// import { useRouter } from 'next/router';
import Sidebar from '@/components/navbars/Sidebar'; // Adjust the import path as necessary
// import './globals.css';

import AdminNavbar from '@/components/navbars/AdminNavbar';
export default function RootLayout({ variant = 'default', children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  

  return (
    <div className="flex bg-gray-100/90 h-screen overflow-hidden">

     {/* Sidebar */}
     <Sidebar  sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

     {/* Content area */}
     <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

       {/*  Site header */}

       <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

       <main
  className={` bg-gray-100/90 dark:bg-gray-900`}
>
        <div className="md:px-4 px-2    w-full  mx-auto">

          {/* Dashboard actions */}
          <div className="  mb-8">

            {/* Left: Title */}
            <div className="mb-4 sm:mb-0 ">
            {children}
            </div>

          
           

          </div>

          

        </div>
      </main>

      

    </div>
  </div>
  );
}