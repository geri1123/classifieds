"use client"
import React, { useMemo, useState } from "react";
import axios from "axios";
import TermAndCondition from "@/components/modal/TermAndCondition";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import useDropdown from "@/hooks/dropdowns/useDropdown";
import Button from "@/components/ui/buttons/Button";
const Signup = () => {
  const { isOpen, isClosing, toggleDropdown, closeDropdown, dropdownRef } = useDropdown();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  


  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repeatpassword: "",
   
    termsAccepted: false,
 
  });


//   if (isAuthenticated) {
//     window.location.href = "/";
//     return null;
//   }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/signup-user`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Signup successful!");
      setUserData({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        repeatpassword: "",
        termsAccepted: false,
       
      });
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ api: "Something went wrong, please try again." });
      }
    }

    setLoading(false);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, 
    }));
  };

  

  return (
    <div className="flex  flex-col items-center mt-6 justify-center">
      <h2 className="text-2xl font-semibold mb-2 text-black">Sign up </h2>
      <div className="bg-gray-100 rounded-lg p-6">
        {errors.api && <p className="text-red-500 text-center text-sm">{errors.api}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              onChange={onChange}
              value={userData.username}
              className="w-full bg-transparent p-2 border border-gray-300 rounded"
              name="username"
              type="text"
              placeholder="Username"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <input
                value={userData.first_name}
                onChange={onChange}
                className="w-full bg-transparent p-2 border border-gray-300 rounded"
                name="first_name"
                type="text"
                placeholder="First Name"
              />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
            </div>
            <div className="w-1/2">
              <input
                value={userData.last_name}
                onChange={onChange}
                className="w-full bg-transparent p-2 border border-gray-300 rounded"
                name="last_name"
                type="text"
                placeholder="Last Name"
              />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
            </div>
          </div>
         
           

          <div>
            <input
              value={userData.email}
              onChange={onChange}
              type="email"
              name="email"
              className="w-full p-2 bg-transparent border border-gray-300 rounded"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
              value={userData.password}
              onChange={onChange}
              type="password"
              name="password"
              className="w-full bg-transparent p-2 border border-gray-300 rounded"
              placeholder="Password"
            />
            {errors.user_password && <p className="text-red-500 text-sm">{errors.user_password}</p>}
          </div>
          <div>
            <input
              value={userData.repeatpassword}
              onChange={onChange}
              type="password"
              name="repeatpassword"
              className="w-full bg-transparent p-2 border border-gray-300 rounded"
              placeholder="Repeat Password"
            />
            {errors.repeatpassword && <p className="text-red-500 text-sm">{errors.repeatpassword}</p>}
          </div>
       
          <div >
            <div className="flex items-start gap-2">

            
            <input
              type="checkbox"
              name="termsAccepted"
              checked={userData.termsAccepted}
              onChange={onChange}
              id="terms"
              className="mt-1 bg-transparent"
            />
            <label htmlFor="terms" className="text-sm dark:text-gray-300 text-gray-700">
            Me dërgimin e formularit, konfirmoni që jeni dakord me  
              <span
                onClick={(e) => {
                  e.stopPropagation(); 
                  e.preventDefault(); 
                  toggleDropdown();
                }} 
                className="cursor-pointer text-blue-700 px-1 hover:border-b border-blue-600"
              >
                kushtet e përdorimit
              </span> 
              dhe politikën e privatësisë
            </label>
            </div>
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
          </div>
         

        
          <Button loading={loading} >
        Signup
      </Button>
        </form>
        <a className="block text-center text-gray-500 mt-4 hover:underline" href="/">
          Return to home page
        </a>
      </div>

      {isOpen && (
        <div
          className={`fixed top-0 left-0 w-full pt-[70px] pb-[70px] overflow-y-auto h-full bg-black-500 flex justify-center items-center z-50 transition-all duration-500 ease-in-out ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        >
          <div
            ref={dropdownRef}
            className={`bg-white rounded max-w-lg max-h-[calc(100vh-140px)] mb-[70px] shadow-lg transition-transform duration-500 ease-out ${isClosing ? 'animate-closeModal' : 'animate-openModal'}`}
          >
            <TermAndCondition closeDropdown={closeDropdown} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;

  {/* <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button> */}
{/* 
      {isOpen && (
        <div
          className={`fixed top-0 left-0 w-full pt-[70px] pb-[70px] overflow-y-auto h-full bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-500 ease-in-out ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        >
          <div
            ref={dropdownRef}
            className={`bg-white rounded max-w-lg max-h-[calc(100vh-140px)] mb-[70px] shadow-lg transition-transform duration-500 ease-out ${isClosing ? 'animate-closeModal' : 'animate-openModal'}`}
          >
            <TermAndCondition closeDropdown={closeDropdown} />
          </div>
        </div>
      )} */}