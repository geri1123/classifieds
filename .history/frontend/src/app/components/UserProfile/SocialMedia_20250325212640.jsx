import { useState } from "react";
import { CgMediaLive } from "react-icons/cg";
import { MdOutlineModeEdit } from "react-icons/md";

export function SocialMedia(){
const [isOpen , setIsOpen]=useState(false);
    return(
        <div className="social-media">
            <div className="flex justify-center items-center">
  <h2 className="flex items-center text-black gap-2 text-lg font-semibold dark:text-gray-200 text-center">
    <CgMediaLive size={18} /> Social Media
  </h2>
  <button onClick={() => setIsOpen(true)} className="flex items-center text-blue-600 dark:text-blue-400 ml-4">
    <MdOutlineModeEdit className="text-lg" />
    <p className="text-[10px] ml-1">edit</p>
  </button>
</div>

            
        </div>
    )

}