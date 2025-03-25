import { useState } from "react";
import { CgMediaLive } from "react-icons/cg";
import { MdOutlineModeEdit } from "react-icons/md";

export function SocialMedia(){
const [isOpen , setIsOpen]=useState(false);
    return(
        <div className="social-media">
            <div className="flex justify-between">
            <h2 className="flex mb-4 items-center text-black gap-2 text-lg font-semibold dark:text-gray-200 text-left w-full"><CgMediaLive size={18}/> Social Media</h2>
                  <button onClick={() => setIsOpen(true)} className=" text-blue-600 dark:text-blue-400 items-center flex">
                                          <MdOutlineModeEdit className="text-lg" />
                                          <p className="text-[10px]">edit</p>
                                          </button>
            </div>

            
        </div>
    )

}