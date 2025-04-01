"use client"
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsBuildingGear } from "react-icons/bs";
import SidebarLinkGroup from "@/components/navbars/SidebarLinkGroup";
import { useDispatch, useSelector } from "react-redux";
import { initSocketListener, addNotification } from "@/store/notificationSlice"; 

const products = [
  { id: "All", type: "All" },
  { id: "Property", type: "Property" },
  { id: "Motors", type: "Motors" },
  { id: "Services", type: "Services" },
  {id:"For Sale" , type :"For Sale"},
  { id: "Jobs", type: "Jobs" }
];

function Sidebar({ sidebarOpen, setSidebarOpen, variant = 'default' }) {
  const pathname = usePathname();
  // const { unreadCount } = useNotifications();
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);

  // Start listening for notifications via Socket.IO when the component mounts
  useEffect(() => {
    dispatch(initSocketListener()); // Start listening to socket events when the component is mounted

    // Clean up listener when the component is unmounted
    return () => {
      // You can manually clean up the listener here if needed.
      socket.off("notification");
    };
  }, [dispatch]); // Dispatch only once
  const storedSidebarExpanded = typeof window !== 'undefined' ? localStorage.getItem("sidebar-expanded") : null;
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === "true");

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("sidebar-expanded", sidebarExpanded);
      if (sidebarExpanded) {
        document.querySelector("body").classList.add("sidebar-expanded");
      } else {
        document.querySelector("body").classList.remove("sidebar-expanded");
      }
    }
  }, [sidebarExpanded]);
 

  return (
    <div className="min-w-fit  ">
      {/* Sidebar backdrop (mobile only) */}
      <div
       ref={sidebar}
        className={`fixed overflow-hidden overflow-y-auto scrollbar dark:scrollbar-dark  inset-0  bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex rounded-tr-xl overflow-hidden overflow-y-auto scrollbar dark:scrollbar-dark lg:!flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-sm'}`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <Link href="/" className="block">
      <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
        <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
      </svg>
    </Link>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Pages</span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <SidebarLinkGroup activecondition={pathname === "/" || pathname.includes("dashboard")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                          pathname === "/" || pathname.includes("dashboard") ? "" : "hover:text-gray-900 dark:hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className={`shrink-0 fill-current ${pathname === "/" || pathname.includes("dashboard") ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                              <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                              <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                            </svg>                            
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Dashboard
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <Link href="/">
                              <span className="block transition duration-150 truncate text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                Main
                              </span>
                            </Link>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <Link href="https://cruip.com/mosaic/">
                              <span className="block transition duration-150 truncate text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                Analytics
                              </span>
                            </Link>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <Link href="https://cruip.com/mosaic/">
                              <span className="block transition duration-150 truncate text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                Fintech
                              </span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            
              {/* Messages */}
              <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname.includes("messages") && "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"}`}>
                <a href="">
                  <div className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("notifications") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="grow flex items-center">
                      <svg
                          className={` shrink-0 fill-current  ${pathname.includes('notifications') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 24c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2zm6.364-6V11c0-3.53-2.61-6.435-6-6.92V3c0-.829-.671-1.5-1.5-1.5S9 2.171 9 3v1.08c-3.39.485-6 3.39-6 6.92v7l-2 2v1h20v-1l-2-2z" />
                        </svg>
                        <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Notifications
                        </span>
                      </div>
                      {/* Badge */}
                      <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-violet-400 px-2 rounded">
                    {notifications.length}
                  </span>
                    </div>
                  </div>
                </a>
              </li>
              {/* notification */}
              <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname.includes("inbox") && "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"}`}>
                <Link href="/myportal/notification">
                  <div className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("notification") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="grow flex items-center">
                        <svg
                          className={` shrink-0 fill-current  ${pathname.includes('notification') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 24c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2zm6.364-6V11c0-3.53-2.61-6.435-6-6.92V3c0-.829-.671-1.5-1.5-1.5S9 2.171 9 3v1.08c-3.39.485-6 3.39-6 6.92v7l-2 2v1h20v-1l-2-2z" />
                        </svg>
                        <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Njoftimet
                        </span>
                      </div>
                      <div className="flex flex-shrink-0 ml-2">
                        {/* <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-violet-400 px-2 rounded">{unreadCount}</span> */}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
              {/* profile */}
              <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname.includes("inbox") && "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"}`}>
                <a href="/MyPortal/profile">
                  <div className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("profile") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center"> 
                        <svg
                          className={`shrink-0 fill-current ${pathname.includes('profile') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 3.582-8 8v1h16v-1c0-4.418-3.582-8-8-8z"
                          />
                        </svg>
                        <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Profile
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname.includes("Post") && "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"}`}>
                <a href="/Post">
                  <div className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("profile") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center"> 
                      <svg
  className={`shrink-0 fill-current ${pathname.includes('Post') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
>
  <path
    d="M19 3h-14c-1.104 0-2 .896-2 2v14c0 1.104.896 2 2 2h14c1.104 0 2-.896 2-2v-14c0-1.104-.896-2-2-2zm-7 16h-2v-4h-4v-2h4v-4h2v4h4v2h-4z"
  />
</svg>
                        <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Post an Add
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
          
              <SidebarLinkGroup activecondition={pathname.includes("settings")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                          pathname.includes("settings") ? "" : "hover:text-gray-900 dark:hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                           
                            <BsBuildingGear className={`${pathname.includes("products")? 'text-violet-500 ':''}text-gray-400 `}/>
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Products
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                        {products.map((e, i)=>(
                           <li key={i} className="mb-1 pl-3 last:mb-0">
                            <a 
                            className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200" 
                            // href={`/MyPortal/products?category=${e.id}`}

                            href={`/MyPortal/products?category=${e.id}`} 
                            // href={`/MyPortal/products/${e.id}`}
                             >
                              {e.type}
                              </a>
                          </li>
                        )) }
                        
                          
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* Utility */}
             
            </ul>
          </div>
          {/* More group */}
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">More</span>
            </h3>
           
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;