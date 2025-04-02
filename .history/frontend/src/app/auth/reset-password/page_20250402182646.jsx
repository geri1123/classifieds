"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { MdLockOutline } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import Button from '@/components/ui/Button';
import ModalDropdown from '@/hooks/dropdowns/ModalDropdown';
import { useSearchParams } from 'next/navigation';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Extract token
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setData] = useState({
    newPassword: '',
    repeatPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/password/reset-password`, 
            {
              token, // Make sure this is correctly included
              newPassword: userData.newPassword,
              repeatPassword: userData.repeatPassword,
            }
          );
          
      setMessage(response.data.message);
      setIsModalOpen(true);
      setError('');
      setData({ newPassword: '', repeatPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setMessage('');
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="flex bg-white dark:bg-gray-800 rounded-lg py-5 px-7 flex-col gap-4 w-[550px] shadow-lg">
        <h2 className="text-xl font-semibold">Reset Password</h2>
        {error && (
          <div className="flex gap-2 items-center">
            <CgDanger className="text-red-500" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <p className="text-gray-600 dark:text-gray-300">
          Please enter your new password. It must be at least 8 characters long.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex items-center border rounded-lg border-gray-300 pl-3 py-2">
            <MdLockOutline className="text-gray-500 w-5 h-5" />
            <input
              type="password"
              placeholder="Enter new password"
              name="newPassword"
              value={userData.newPassword}
              onChange={onChange}
              className="bg-transparent rounded w-full border-none focus:ring-0 outline-none px-2 py-1"
            />
          </div>

          <div className="flex items-center border rounded-lg border-gray-300 pl-3 py-2">
            <MdLockOutline className="text-gray-500 w-5 h-5" />
            <input
              type="password"
              placeholder="Repeat new password"
              name="repeatPassword"
              value={userData.repeatPassword}
              onChange={onChange}
              className="bg-transparent rounded w-full border-none focus:ring-0 outline-none px-2 py-1"
            />
          </div>

          <Button>Reset Password</Button>
        </form>

       
      </div>
      <ModalDropdown isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); window.location.href="/"};}>
  <p>{message}</p>
</ModalDropdown>
    </div>
  );
};

export default ResetPassword;
