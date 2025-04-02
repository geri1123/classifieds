"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { MdLockOutline } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import Button from '@/components/ui/Button';
import Success from '@/components/modal/Success';
import { useSearchParams } from 'next/navigation';
const ResetPassword = () => {
  
  const searchParams = useSearchParams();
const token = searchParams.get("token"); // Extract token
  const [userData , setData]=useState({
    newPassword:'',
    repeatPassword:'',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
const onChange=(e)=>{
  e.preventDefault();
  const {name , value}=e.target;
  setData((prev)=>({...prev , [name]:value}));

}
const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:8081/password/reset-password", {
        token, // Make sure this is correctly included
        newPassword: userData.newPassword,
        repeatPassword: userData.repeatPassword
      });
      setMessage(response.data.message);
      setError('');
      setData({ newPassword: '', repeatPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setMessage('');
    }
  };
  return (
    <div className="w-full h-auto mt-7  flex  justify-center ">
        <div className="flex bg-white dark:bg-gray-800 rounded-lg py-5 px-7 flex-col gap-4 w-[550px]">
        <h2 className="text-xl">Reset Fjalekalimin</h2>
        {error && <div className="flex gap-2 items-center"><CgDanger className="dark:text-red-500 text-red-700"/> <p className="dark:text-red-500 text-red-700 text-sm">{error}</p></div>}

        <p>Ju lutem plotesoni fjalekalimin tuaj te ri me te pakten 8 karaktere.</p>
      <form className="flex gap-5 flex-col" onSubmit={handleSubmit}>
      <div className="flex items-center border rounded-lg border-gray-300 pl-3 py-1">
            <MdLockOutline className=" text-gray-500 w-5 h-5"/>
        <input
          type="password"
          placeholder="Enter new password"
          name="newPassword"
          value={userData.newPassword}
          onChange={onChange}
          className="bg-transparent rounded w-full border-none"
        
        />
        </div>
        <div className="flex items-center border rounded-lg border-gray-300 pl-3 py-1">
            <MdLockOutline className=" text-gray-500 w-5 h-5"/>
        <input
          type="password"
          placeholder="Repeat new password"
          name="repeatPassword"
          value={userData.repeatPassword}
          onChange={onChange}
          className="bg-transparent rounded w-full border-none"
        
        />
        </div>
        <Button>
        Reset Password
        </Button>
        {/* <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" type="submit">Reset Password</button> */}
      </form>
      {message && <Success success={message} setSuccess={setMessage}/>}
    </div>
    </div>
  );
};

export default ResetPassword;