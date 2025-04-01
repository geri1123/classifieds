// import ModalDropdown from "@/hooks/dropdowns/ModalDropdown"; 
// import { useEffect, useState } from "react";
// import { MdOutlineModeEdit, MdOutlineMail } from "react-icons/md";
// import InputField from "@/components/ui/InputField";
// import Button from "@/components/ui/Button";

// export function ChangeEmail({ user, mutate }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [errors, setErrors] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [userData, setUserData] = useState({ email: '' });

//   useEffect(() => {
//     if (user?.email) {
//       setUserData({ email: user.email });
//     }
//   }, [user]);

//   const changeHandler = (e) => {
//     setUserData({ email: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors('');
//     setSuccessMessage('');

//     setTimeout(async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-email`, {
//           method: 'POST',
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email: userData.email }),
//         });

//         const result = await response.json();
//         mutate();

//         if (result.error) {
//           setErrors(result.error);
//         } else {
//           setSuccessMessage(result.message);
         
//         }
//       } catch (error) {
//         setErrors('Server error. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     }, 2000);
//   };

//   const isDisabled = loading || !userData.email || userData.email === user?.email;

//   return (
//     <div>
      
//       <div className="flex items-center">
       
//         <button onClick={() => setIsOpen(true)} className="flex gap-3 items-center">
//         <h2 className=" flex items-center gap-1 dark:text-gray-100 text-black">
//           <MdOutlineMail size={20} />
//           <span className="border-b border-b-gray-900 dark:border-b-gray-100">{user?.email}</span>
//         </h2>
//           <div className=" text-blue-600 dark:text-blue-400 items-center flex">
//           <MdOutlineModeEdit className="text-lg" />
//           <p className="text-[10px]">edit</p>
//           </div>
//         </button>
//       </div>

      
       
//         <ModalDropdown isOpen={isOpen} onClose={() => {setIsOpen(false) ; setErrors('') ; setSuccessMessage('');  setUserData({ email: user?.email });  }}>
//         <h2 className="dark:text-sky-400 text-sky-800  mb-4 text-xl">Change Email</h2>

//         <form onSubmit={handleSubmit}>
//             {successMessage && <p className="text-green-500">{successMessage}</p>}
//             <div className="mb-4">
//               <InputField
//                 label="Email"
//                 type="email"
//                 value={userData.email}
//                 onChange={changeHandler}
//                 id="email"
//                 name="email"
//                 placeholder="Email"
//                 errors={errors}
//               />  
              
             
            
//             </div>
//         <Button type="submit" disabled={isDisabled}>
//                 {loading ? 'Loading...' : 'Save Changes'}
//               </Button>
//         </form>
//       </ModalDropdown>
     
//     </div>
//   );
// }
import ModalDropdown from "@/hooks/dropdowns/ModalDropdown"; 
import { useEffect, useState } from "react";
import { MdOutlineModeEdit, MdOutlineMail } from "react-icons/md";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export function ChangeEmail({ user, mutate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState({ email: user?.email || '' });

  // Update userData when user changes (after mutation)
  useEffect(() => {
    setUserData({ email: user?.email || '' });
  }, [user]);

  const changeHandler = (e) => {
    setUserData({ email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-email`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email }),
      });

      const result = await response.json();

      if (result.error) {
        setErrors(result.error);
      } else {
        setSuccessMessage(result.message);
        await mutate(); // **Ensure user data is refetched**
      }
    } catch (error) {
      setErrors('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !userData.email || userData.email === user?.email;

  return (
    <div>
      <div className="flex items-center">
        <button onClick={() => setIsOpen(true)} className="flex gap-3 items-center">
          <h2 className="flex items-center gap-1 dark:text-gray-100 text-black">
            <MdOutlineMail size={20} />
            <span className="border-b border-b-gray-900 dark:border-b-gray-100">{user?.email}</span>
          </h2>
          <div className="text-blue-600 dark:text-blue-400 items-center flex">
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
          setUserData({ email: user?.email || '' }); // **Reset to the latest email when closing**
        }}
      >
        <h2 className="dark:text-sky-400 text-sky-800 mb-4 text-xl">Change Email</h2>

        <form onSubmit={handleSubmit}>
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <div className="mb-4">
            <InputField
              label="Email"
              type="email"
              value={userData.email}
              onChange={changeHandler}
              id="email"
              name="email"
              placeholder="Email"
              errors={errors}
            />
          </div>

          <Button type="submit" disabled={isDisabled}>
            {loading ? 'Loading...' : 'Save Changes'}
          </Button>
        </form>
      </ModalDropdown>
    </div>
  );
}
