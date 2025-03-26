import { useState } from 'react'
import ModalDropdown from '@/hooks/dropdowns/ModalDropdown'
export function DeleteProfile(){
    const [isOpen , setIsOpen]= useState(false)

        
    return(
        <div>
           <button onClick={() => setIsOpen(true)} className="border-2 rounded-md px-3 py-2 color-yellow-40 border-yellow-40">
            Delete Profile
           </button>
           <ModalDropdown isOpen={isOpen} onClose={()=> setIsOpen(false)} >
            <div className="flex flex-col gap-4">
                <p className="text-xl font-semibold">Delete Profile</p>
                <p className="text-sm">Are you sure you want to delete your profile?</p>
                <div className="flex gap-4">
                    <button className="border-2 rounded-md px-3 py-2 color-yellow-40 border-yellow-40">Yes</button>
                    <button className="border-2 rounded-md px-3 py-2 color-yellow-40 border-yellow-40">No</button>
                </div>
            </div>
            </ModalDropdown>
        </div>
    )

}