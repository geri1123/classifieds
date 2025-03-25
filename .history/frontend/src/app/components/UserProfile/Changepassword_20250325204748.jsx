import { useState } from "react";
import { GoKey } from "react-icons/go";
import ModalDropdown from "@/hooks/dropdowns/ModalDropdown";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
export function ChangePassword(){
    const [formData , setFormData]=useState({
        currentPassword:'',
        newPassword:'',
        confirmNewPassword:''
    })
    const [isOpen , setIsOpen]=useState(false);
    const [errors, setErrors] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
 
    const changeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { currentPassword, newPassword, confirmNewPassword } = formData;
    
        setLoading(true);
        // setErrors({}); // Reset errors
        // setSuccessMessage('');
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/change-password`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
            });
    
            const result = await response.json();
            
            if (!response.ok) {
                // Ensure errors are stored correctly
                if (typeof result.error === "string") {
                    setErrors({ general: result.error }); // General error
                } else {
                    setErrors(result.error || {}); // Assign field-specific errors
                }
            } else {
                setSuccessMessage(result.message);
                setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                setErrors({});
                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000);
            }
        } catch (err) {
            setErrors({ general: 'Server error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };
      const isDisabled =
loading ||
(!formData.newPassword  && !formData.confirmNewPassword && !formData.currentPassword);
    return(
        <div>
           <button onClick={() => setIsOpen(true)} className="dark:text-blue-400 flex items-center gap-2 text-blue-600 text-lg">
           <GoKey className="text-lg"/> Change Password
           </button>
              <ModalDropdown isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <h2 className="dark:text-sky-400 text-sky-800  mb-4 text-xl">Ndrysho Fjalekalimin</h2>
              <form onSubmit={handleSubmit} className="w-full md:w-full">
              {loading ? null : successMessage && <p className="text-green-500">{successMessage}</p>}
              {errors.general && (
        <p className="text-sm text-red-500 mb-2">{errors.general}</p>

    )}
                <InputField
                   label="Current password"
                   value={formData.currentPassword}
                   onChange={changeHandler}
                   id="currentPassword"
                   name="currentPassword"
                   placeholder="Fjalekalimi aktual"
                   errors={errors?.currentPassword || ""}
                   type="password"

                />
                <div className="flex gap-2">
                <InputField
                  label="New password"
                  value={formData.newPassword}
                  onChange={changeHandler}
                  id="newPassword"
                  name="newPassword"
                  placeholder="Fjalekalimi i ri"
                  errors={errors?.newPassword || ""}
                  type="password"
                />
                <InputField
                  label="Repeat password"
                  value={formData.confirmNewPassword}
                  onChange={changeHandler}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  placeholder="Konfirmo fjalekalimin"
                  errors={errors?.confirmNewPassword || ""}
                  type="password"
                />
                </div>
                <Button type="submit" disabled={isDisabled }>
              {loading ? 'Loading...' : 'Ndrysho '}
            </Button>
              </form>
              </ModalDropdown>
        </div>
    )

}
