import { FaRegEye } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
export function Other(){
    return(
        <div className="flex justify-end flex-col gap-2 md:gap-3 w-full">
            <a className="md:text-sm text-xs md:w-[170px] flex items-center gap-1 font-semibold border-2 dark:text-gray-200 font-medium text-black rounded-lg p-2 md:p-2 dark:border-gray-200 border-yellow-40">
            <FaRegEye size={15}/>  Public Profile
            </a>
            <a href="/Post" className="md:text-sm text-xs  flex items-center gap-1 font-semibold border-2 dark:text-gray-200 text-black font-medium rounded-lg md:p-2 p-2 dark:border-gray-200 border-yellow-40">
            <IoIosAddCircleOutline size={15}/> Post an Add
            </a>
        </div>
    )
}