"use client"
import React from 'react'; 
import { useUser } from '@/context/UserContext.jsx';
import { LuUserRound } from "react-icons/lu"; 
import UploadProfileImage from '@/components/UserProfile/UploadProfileImage';
import { ChangeUsername } from '@/components/UserProfile/ChangeUsername';
import { ChangeEmail } from '@/components/UserProfile/ChangeEmail';
import { ChangeFnameLname } from '@/components/UserProfile/ChangeFnameLname';
import { AboutMe } from '@/components/UserProfile/AboutMe';
import { ReceiveNotification } from '@/components/UserProfile/ReceiveNotification';
import { Other } from '@/components/UserProfile/Other';
import { ChangePassword } from '@/components/UserProfile/Changepassword';
import { Contact } from '@/components/UserProfile/Contact';
import { SocialMedia } from '@/components/UserProfile/SocialMedia';


const Profile = () => { 
  const { user, setUser ,  mutate } = useUser(); 
  // const profileimg = getProfileImageUrl(userInfo?.profile_img); 

  return ( 
    <div className="flex flex-col md:gap-6 gap-4 my-4 md:my-5 max-w-screen   lg:p-6"> 
        <div className="flex items-center gap-4"> 
          <LuUserRound className="md:text-3xl text-2xl dark:text-white text-gray-700" /> 
          <h1 className="md:text-3xl text-2xl font-semibold dark:text-white text-gray-900">Profile</h1> 
        </div> 

  {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
    
    {/* Profile Information & Settings */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row  items-start gap-4 md:gap-6">
        {/* Profile Image and Upload */}
        <div className='md:block md:w-auto w-full flex justify-between'>
                  <UploadProfileImage user={user} setUser={setUser} mutate={mutate}/> 
                  <div className='md:hidden block'><Other user={user}/></div>
                  </div>
        {/* User Details Section */}
                 <div className='flex sm:flex-row flex-col w-full justify-between'>
                    <div className="flex flex-col gap-2 md:gap-3 w-full">
                        <h2 className="text-lg font-semibold dark:text-white">
                          {user?.role.toUpperCase()}
                        </h2>
                      {/* <ChangeUsername user={user} setUser={setUser} mutate={mutate}/> */}
                      {/* <ChangeFnameLname user={user} setUser={setUser} mutate={mutate}/> */}
                      {/* <ChangeEmail user={user} setUser={setUser} mutate={mutate}/> */}
                    </div>
                    <div  className='md:block hidden'>
                  <Other user={user}/>
                  
                  </div>
                  </div>
                  </div>
      {/* Other Settings */}
           <div className="flex sm:flex-row gap-3 items-start flex-col justify-between md:mt-6 mt-5 ">
           {/* <ChangePassword user={user}/> */}
               {/* <ReceiveNotification user={user}/> */}
             
            </div>
    </div>

    {/* Property Section */}
    <div className="h-full ">
      {/* <AboutMe user={user} mutate={mutate}/> */}
    </div>
    
  </div>
  <div className="p-6 flex justify-between bg-white dark:bg-gray-800 rounded-lg shadow-md">
    {/* <Contact user={user} mutate={mutate}/> */}
    <SocialMedia/>
  </div>
</div>
  ); 
}; 

export default Profile;
