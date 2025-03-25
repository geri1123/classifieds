"use client";
import { useState } from "react";
import { FiShoppingCart, FiUsers } from "react-icons/fi";
import { FaCar, FaHome, FaBriefcase } from "react-icons/fa";
import Button from "@/components/ui/Button";
export default function FiltersSection() {
  const [activeTab, setActiveTab] = useState("Motors");

  const tabs = [
    { name: "Motors", icon: <FaCar /> },
    { name: "Property", icon: <FaHome /> },
    { name: "Jobs", icon: <FaBriefcase /> },
    { name: "For Sale", icon: <FiShoppingCart /> },
    { name: "Services", icon: <FiUsers /> },
  ];

  return (
    <div className="max-w-full mx-auto py-6 px-20">
      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-200 border-1
              ${activeTab === tab.name ? "bg-white border-2  text-black  border-t-yellow-40" : "bg-gray-100 text-gray-700 border-transparent"}`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-4 gap-4 border border-gray-200">
        {/* Category */}
        <div>
          <label className="block text-gray-600">Category</label>
          <select className="w-full border-2 border-yellow-40 rounded-md px-3 py-2 outline-none focus:outline-none focus:border-yellow-500  focus:ring-0">
            <option>- Any -</option>
          </select>
        </div>

        {/* Make & Model */}
        <div>
          <label className="block text-gray-600">Make</label>
          <input type="text" className="w-full border rounded-md px-3 py-2 bg-gray-200 outline-none " placeholder="- Any -" disabled />
        </div>
        <div>
          <label className="block text-gray-600">Model</label>
          <input type="text" className="w-full border rounded-md px-3 py-2 bg-gray-200 outline-none" placeholder="- Any -" disabled />
        </div>

        {/* Price */}
        <div className="col-span-1">
          <label className="block text-gray-600">Price</label>
          <div className="flex gap-2">
            <input type="text" placeholder="from" className="border-2 border-yellow-40 rounded-md px-3 py-2 w-1/3 outline-none focus:outline-none focus:border-yellow-500  focus:ring-0" />
            <input type="text" placeholder="to" className="border-2 border-yellow-40 rounded-md px-3 py-2 w-1/3 outline-none focus:outline-none focus:border-yellow-500  focus:ring-0" />
            <select className="w-1/3 border-2 border-yellow-40 rounded-md px-3 py-2 outline-none focus:outline-none focus:border-yellow-500  focus:ring-0">
              <option>Any</option>
            </select>
          </div>
        </div>

        {/* Built Year */}
        <div>
          <label className="block text-gray-600">Built</label>
          <div className="flex gap-2">
            <select className="w-1/2 border-2 border-yellow-40 rounded-md px-3 py-2 outline-none focus:outline-none focus:border-yellow-500  focus:ring-0">
              <option>from</option>
            </select>
            <select className="w-1/2 border-2 border-yellow-40 rounded-md px-3 py-2 outline-none focus:outline-none focus:border-yellow-500  focus:ring-0">
              <option>to</option>
            </select>
          </div>
        </div>

        {/* Body Style & Transmission */}
        <div>
          <label className="block text-gray-600">Body Style</label>
          <select className="w-full border-2 border-yellow-40 rounded-md px-3 py-2 outline-none focus:outline-none focus:border-yellow-500  focus:ring-0">
            <option>- Any -</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600">Transmission</label>
          <select className="w-full border-2 border-yellow-40 rounded-md px-3 py-2 outline-none focus:outline-none focus:border-yellow-500  focus:ring-0">
            <option>- Any -</option>
          </select>
        </div>
        <div className="col-span-1 flex items-end">
  {/* <button className="w-full h-2/3 bg-yellow-40 hover:bg-yellow-400 text-black px-4 py-2 rounded-md font-medium shadow-md border border-yellow-40 ">
    Search
  </button> */}
  <Button>
    Search
  </Button>

</div>
        {/* Search Button */}
        
      </div>
      
    </div>
  );
}
