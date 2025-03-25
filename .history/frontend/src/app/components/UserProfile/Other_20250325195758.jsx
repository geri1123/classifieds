import { FaRegEye } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
export function Other(){
    return(
        <div className="flex justify-end flex-col gap-2 md:gap-3 w-full">
            <button className="md:text-sm text-xs md:w-[170px] flex items-center gap-1 font-semibold border dark:text-gray-200 text-gray-800 rounded-lg p-2 md:p-2 dark:border-gray-200 border-gray-900">
            <FaRegEye size={15}/>  Shiko profilin Publik
            </button>
            <button className="md:text-sm text-xs  flex items-center gap-1 font-semibold border dark:text-gray-200 text-gray-800 rounded-lg md:p-2 p-2 dark:border-gray-200 border-gray-900">
            <IoIosAddCircleOutline size={15}/> Shto Prone
            </button>
        </div>
    )
}