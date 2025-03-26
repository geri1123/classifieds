import { useState } from 'react'
import ModalDropdown from '@/hooks/dropdowns/ModalDropdown'
export function DeleteProfile(){
    const [isOpen , setIsOpen]= useState(false)

        
    return(
        <div>
           <button onClick={() => setIsOpen(true)} className="border-2 rounded-md px-3 py-2 color-yellow-40 border-yellow-40">
            Delete Profile
           </button>
        </div>
    )

}