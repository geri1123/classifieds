"use client"
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { FiUpload } from "react-icons/fi";
import { HiMiniPlus } from "react-icons/hi2";

 const UploadProfileImage = ({ setUser, user, mutate }) => {
  const fileInputRef = useRef(null);
  const [userProfile, setUserProfile] = useState(null);
  // const profileimg = getProfileImageUrl(userInfo?.profile_img); 
  
  const handleUploadClick = () => {
    fileInputRef.current.click(); // Trigger file input dialog
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profile_img', selectedFile);

    try {
      const response = await axios.post(
        'http://localhost:8081/api/update-profileImg',
        formData,
        {
          withCredentials: true, // Ensure credentials are sent with request
        }
      );

      if (response.data.success) {
        console.log('Profile image upload successful:', response.data.profilePicture);
        setUserProfile(response.data.profilePicture);
        // fetchUserInfo();
        mutate();
      } else {
        console.error('Failed to upload profile image.');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      {/* Profile Image Container */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full group">
        {/* Profile Image */}
        <img className="w-full h-full object-cover rounded-full border-4 border-yellow-40" src={user?.profile_img? user?.profile_img :"/images/nprf.jpg" } alt="profile" />

        {/* Small Plus Icon (Always Visible) */}
        <div className="absolute right-2 bottom-2 p-1 bg-gray-800 rounded-full">
          <div className="bg-black p-2  rounded-full text-white cursor-pointer">
            <HiMiniPlus size={20} />
          </div>
        </div>

        {/* Full-Sized Overlay Button (Appears on Hover) */}
        <div 
          className="absolute inset-0 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleUploadClick}
        >
          <button className="w-full h-full rounded-full flex flex-col items-center justify-center">
            <FiUpload size={40} className="text-gray-200" /> 
            <small className="text-gray-200">
              {!user?.profile_img ? 'Upload Profile' : 'Change Profile Image'}
            </small>
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg, image/jpg, image/png"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* User Info Below Profile */}
      {/* <div className="text-center mt-2">
        <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-800">{user?.username || "User Name"}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300">{user?.email || "user@example.com"}</p>
     
      </div> */}
    </div>
  );
};

export default UploadProfileImage;