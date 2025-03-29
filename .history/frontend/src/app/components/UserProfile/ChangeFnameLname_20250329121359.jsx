import { useEffect, useState } from 'react'
import { MdPerson } from "react-icons/md";
import ModalDropdown from "@/hooks/dropdowns/ModalDropdown";
import { MdOutlineModeEdit } from "react-icons/md";
import Button from "@/components/ui/Button";
import InputField from '@/components/ui/InputField';
export function ChangeFnameLname({user, mutate}){
    const [userData , setUserData]= useState({
        first_name:"",
        last_name: "",
    })
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user?.first_name && user?.last_name) {
            setUserData({
                first_name: user.first_name,
                last_name: user.last_name
            });
        }
    }, [user]);
  const changeHandler=(e)=>{
    const {name , value}=e.target;
    setUserData((prev)=>{
        return{
            ...prev,
            [name]:value,
           
        }
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setLoading(true);
    setErrors('');
    setSuccessMessage('');

    setTimeout(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-firstnamelastName`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
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
const isDisabled =
loading ||
!userData.first_name.trim() ||
!userData.last_name.trim() ||
(userData.first_name === user?.first_name && userData.last_name === user?.last_name);

    return(
       <div>
      
      <div className="flex items-center gap-4">
     
        <button onClick={() => setIsOpen(true)} className="flex gap-3  items-center">
        <h2 className="flex items-center dark:text-gray-100 text-black gap-1 ">
  <MdPerson size={20} />
  <span className='border-b border-b-gray-900 dark:border-b-gray-100'>{user?.first_name} {user?.last_name}</span>
</h2>           <div className='dark:text-blue-400 text-blue-600 flex items-center'>
          <MdOutlineModeEdit className="text-lg" />
          <p className="text-[10px]">edit</p>
          </div>
        </button>
      </div>

      
       
        <ModalDropdown isOpen={isOpen} onClose={() => {setIsOpen(false); setSuccessMessage(''); setErrors('')}}>
        <h2 className="dark:text-sky-400 text-sky-800  mb-4 text-xl">Change First name and Last name</h2>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form  onSubmit={handleSubmit}>
          
            
            <div className='flex flex-col gap-3'>
            <InputField
                label="Emri"
                value={userData.first_name}
                onChange={changeHandler}
                id="first_name"
                name="first_name"
                placeholder="Emri"
                type="text"
                errors={errors}
              />
              
              <InputField
                label="Mbiemri"
                value={userData.last_name}
                onChange={changeHandler}
                id="last_name"
                name="last_name"
                placeholder="Mbiemri"
                type="text"
                errors={errors}
              />
             
              
             
            </div>
            <Button type="submit" disabled={isDisabled}>
                {loading ? 'Loading...' : 'Save Changes'}
              </Button>
        </form>
      </ModalDropdown>
     
    </div>
    )

}