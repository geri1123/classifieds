
import { MdOutlineModeEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import ModalDropdown from "@/hooks/dropdowns/ModalDropdown"; // Import the reusable ModalDropdown component
import Button from "@/components/ui/Button"; 
import InputField from "@/components/ui/InputField";
export function ChangeUsername({ user , mutate }) {
  const [userData, setUserData] = useState({
    username: '',
    next_username_update: null,
  });
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Control modal open/close state

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const isUsernameEditable = () => {
    if (!userData.next_username_update) return true;
    return new Date() > new Date(userData.next_username_update);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Check if the current username is the same as the new username
  const isUsernameSameAsCurrent = () => {
    return userData.username === user?.username;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors('');
    setSuccessMessage('');
    setTimeout(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-username`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();
        mutate(); 
        if (result.error) {
          setErrors(result.error);
        } else {
          setSuccessMessage(result.message);
          setUserData({
            ...userData,
            next_username_update: result.nextUsernameUpdate,
          });
          setTimeout(() => setSuccessMessage(''), 5000);
        }
      } catch (error) {
        setErrors('Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div>
      <div className="flex items-center ">
     
          
      
      
       <button onClick={() => setIsOpen(true)} className="flex  items-center gap-3">
       <h2 className=" dark:text-gray-100 text-black flex items-center gap-1">@ <span className="border-b border-b-gray-900 dark:border-b-gray-100">{user?.username}</span></h2>
          
          <div className="flex dark:text-blue-400 text-blue-600 items-center ">
            <MdOutlineModeEdit className="text-lg" />
          <p className="text-[10px]">edit</p>
          </div>
        </button>
      </div>

      <ModalDropdown isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <h2 className="dark:text-sky-400 text-sky-800  mb-4 text-xl">Ndrysho Username</h2>
      <form onSubmit={handleSubmit} className="w-full md:w-full">
          {loading ? null : errors && <p className="text-red-500">{errors}</p>}
          {loading ? null : successMessage && <p className="text-green-500">{successMessage}</p>}

          <div className="w-full mb-4">
          <InputField
        label="Username"
        value={userData.username}
        onChange={changeHandler}
        id="username"
        name="username"
        placeholder="Username"
        errors={errors.username}
        type="text"
        disabled={!isUsernameEditable()}
        infoMessage={
          !isUsernameEditable() && 
          `You cannot change your username until ${new Date(userData.next_username_update).toLocaleString()}.`
        }
      />
           
          </div>

          <p className="text-sm text-gray-500 mb-2">
            Most cases allow username changes, but if you update your username, you must wait 10 days before making another change.
          </p>

          {isUsernameEditable() && (
           
            <Button type="submit" disabled={loading || isUsernameSameAsCurrent()}>
              {loading ? 'Loading...' : 'Channge'}
            </Button>
          )}
        </form>
      </ModalDropdown>
    </div>
  );
}