"use client"
import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineMail } from "react-icons/ai";
import Button from '@/components/ui/Button';
import { RiArrowGoBackFill } from "react-icons/ri";
// import Success from '@/components/modal/Success';
// import SuccessPublished from '../../Components/Modal/SuccessPublished.jsx'
import { CgDanger } from "react-icons/cg";
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);

  
const [timeLeft, setTimeLeft] = useState(null);

useEffect(() => {
  if (!expiresAt) return;

  const interval = setInterval(() => {
    const now = Date.now();
    const remaining = Math.max(0, expiresAt - now); // Koha e mbetur

    setTimeLeft(remaining);

    if (remaining === 0) {
      clearInterval(interval); // Ndalo numërimin kur koha përfundon
    }
  }, 1000);

  return () => clearInterval(interval); // Pastrimi i intervalit
}, [expiresAt]);
const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

//
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/password/forgot-password`, { email });
      setMessage(response.data.message);
      setExpiresAt(response.data.expiresAt); // Ruaj kohën e skadimit
      setError('');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setMessage('');
    }
  };
  return (
    <div className="w-full h-screen flex flex-col gap-5 justify-center items-center bg-gray-100">
    <div className="flex bg-white dark:bg-gray-800 rounded-lg py-5 px-7 flex-col gap-4 w-[550px] shadow-lg">
      
      {error && (
        <div className="flex gap-2 items-center">
          <CgDanger className="text-red-500" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
  
      <h2 className="text-xl">Reset Password</h2>
      <p>
        If you have forgotten your password, enter your email address below and you will receive an email with a password reset link.
      </p>
  
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex items-center border rounded-lg border-gray-300 pl-3 py-1">
          <AiOutlineMail className="text-gray-500 w-5 h-5" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            className="bg-transparent rounded w-full border-none outline-none px-2 py-1"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button>Send the link to reset your password.</Button>
      </form>
  
      {timeLeft !== null && (
        <p className="text-gray-500">
          Link expires at: <strong>{formatTime(timeLeft)}</strong>
        </p>
      )}
    </div>
    <div className='flex items-center'>
    <RiArrowGoBackFill size={20} color='blue'/>
    <a className='text-blue-800' href="/">Go back home</a>
    </div>
   
  </div>
  );
};

export default ForgotPassword;
