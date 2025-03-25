
import { useEffect, useState } from 'react';
import { FaInfoCircle } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import ModalDropdown from "@/hooks/dropdowns/ModalDropdown";
import Button from '@/components/ui/Button';
export function AboutMe({user , mutate}) {
    const [loading, setLoading] = useState(false);
    const [isOpen , setIsOpen]=useState(false)
    // const [aboutMe, setAboutMe] = useState( '');
    const [errors, setErrors] = useState('');
    const [aboutMe, setAboutMe] = useState(user?.about_me || '');

    const [successMessage, setSuccessMessage] = useState('');
    // useEffect(() => {
    //     if (user?.about_me) {
    //         setAboutMe(user.about_me);
    //     }
    // }, [user]);
    useEffect(() => {
        setAboutMe(user?.about_me || ''); // Ensure it's always a string
    }, [user]);
    const handlesubmit=async(e)=>{
        e.preventDefault()
        setLoading(true)
        setTimeout(async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-about-me`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              about_me: aboutMe,
            }),
          });
          const result = await response.json();
          mutate();
          if (result.error) {
            setErrors(result.error);
          } else {
            setSuccessMessage(result.message);
           
          }
          setLoading(false);
        }, 2000);
    }
    const isDisabled = loading || aboutMe === user?.about_me;
    
    return (
        <div className="bg-white w-full p-6 gap-3 h-full dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center">
           <div className="flex items-center justify-between w-full"> 
            <h2 className=" flex items-center text-gray-800 gap-2 text-lg font-semibold dark:text-gray-200 text-left w-full">
                <FaInfoCircle/>Rreth Meje
                </h2>
                 <button onClick={() => setIsOpen(true)} className=" text-blue-600 dark:text-blue-400 items-center flex">
                          <MdOutlineModeEdit className="text-lg" />
                          <p className="text-[10px]">edit</p>
                          </button>
            </div>
            <div className="border scrollbar xl:h-40 overflow-y-auto rounded-lg p-3 dark:border-gray-200 border-yellow-700 w-full break-words whitespace-normal">
                <p className="dark:text-gray-200 text-base text-gray-800">
                  {user?.about_me ? (
                    user.about_me
                  ) : (
                    <span className="text-gray-500">No information</span>
                  ) }
                </p>
            </div>
            <ModalDropdown isOpen={isOpen}  onClose={() => {setIsOpen(false);setErrors("") ;setSuccessMessage("");   setAboutMe(user?.about_me || ""); }}>
            <h2 className="dark:text-sky-400 text-sky-800  mb-4 text-xl">Ndrysho Reth meje</h2>
            {errors && (
        <p className="text-sm text-red-600 mb-1">{errors}</p>
      )}
       {successMessage && <p className="text-green-500">{successMessage}</p>}
               <form onSubmit={handlesubmit}>
              <textarea value={aboutMe} name='about_me'  onChange={(e) => setAboutMe(e.target.value)} className='bg-transparent mb-2 w-full'/>
              <Button disabled={isDisabled}>
                {loading ? 'Loading...' : 'Ndrysho'}
              </Button>
               </form>
              
               
            </ModalDropdown>
        </div>
    );
}
