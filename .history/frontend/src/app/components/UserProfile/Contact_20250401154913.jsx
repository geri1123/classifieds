import ModalDropdown from "@/hooks/dropdowns/ModalDropdown"; 
import { useEffect, useState } from "react";
import { MdOutlineModeEdit, MdOutlineMail } from "react-icons/md";
import Button from "@/components/ui/Button";
import { MdOutlineContactSupport } from "react-icons/md";
import { FaPhoneAlt, FaExclamationCircle } from "react-icons/fa";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export function Contact({ user, mutate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState({ phone: '' });

  useEffect(() => {
    if (user?.phone) {
      setUserData({ phone: user.phone });
    }
  }, [user]);

  
  const changeHandler = (value) => {
    setUserData({ phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors('');
    setSuccessMessage('');

    setTimeout(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-phone`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: userData.phone }),
        });

        const result = await response.json();
        mutate();

        if (result.error) {
          setErrors(result.error);
        } else {
          setSuccessMessage(result.message);
          
        }
      } catch (error) {
        setErrors('Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

 
  const isDisabled = loading ||  userData.phone === user?.phone;

  return (
    <div>
      <h2 className="flex mb-4 items-center text-black gap-2 text-lg font-semibold dark:text-gray-200 text-left w-full">
        <MdOutlineContactSupport /> Contacts
      </h2>
      <div className="flex  flex-col items-start ml-6 gap-2  ">
        
          <h2 className="flex items-center gap-1 dark:text-gray-100 text-black">
            <MdOutlineMail size={17} />
            <span>{user?.email}</span>
          </h2>
        

        <button onClick={() => setIsOpen(true)} className="flex gap-3 items-center">
          <h2 className="flex items-center gap-1 dark:text-gray-100 text-black">
          {user?.phone   <FaPhoneAlt size={17} />}
            <span className={`border-b border-b-gray-900 dark:border-b-gray-100 ${user?.phone ? 'text-gray-800 dark:text-gray-200' : 'text-red-500 italic flex items-center gap-1'}`}>
              {!user?.phone && <FaExclamationCircle className="text-red-500" />}
              {user?.phone || 'Shtoni nje nr telefoni'}
            </span>
          </h2>
          <div className="flex dark:text-blue-400 text-blue-600 items-center">
            <MdOutlineModeEdit className="text-lg" />
            <p className="text-[10px]">edit</p>
          </div>
        </button>
      </div>

      <ModalDropdown 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false);
          setErrors('');
          setSuccessMessage('');
          setUserData({ phone: user?.phone || '' }); 
        }}
      >
        <h2 className="dark:text-sky-400 text-sky-800 mb-4 text-xl">
          {user?.phone ? 'Change Phone Number' : 'Add Phone Number'}
        </h2>

        <form onSubmit={handleSubmit}>
          {errors && <p className="text-red-500">{errors}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          
          <div className="mb-4">
          <PhoneInput
  defaultCountry="al"
  value={userData.phone}
  onChange={changeHandler}
  id="phone"
  name="phone"

  containerClassName="w-full bg-transparent border-none"
  inputClassName="bg-transparent text-gray-800 dark:text-gray-200 w-full focus:outline-none border-none"
/>

          </div>

          <Button type="submit" disabled={isDisabled}>
            {loading ? 'Loading...' : user?.phone ? 'Save Changes' : 'Add'}
          </Button>
        </form>
      </ModalDropdown>
    </div>
  );
}
