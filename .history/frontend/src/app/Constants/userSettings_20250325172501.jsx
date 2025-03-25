import { MdOutlineHomeWork } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiHeart } from "react-icons/fi";
import { MdOutlineSaveAlt } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";

export const userSettings=[
    {element:'Profile' , icon:<CgProfile/> ,path:'/profile'},
    {element:'Published', icon:<MdOutlineHomeWork/>,path:'PropertyList?status=all'},
    {element:'Te preferuara' , icon:<FiHeart/> ,path:'favourites'},
    {element:'Kerkime te ruajtura', icon:<MdOutlineSaveAlt/>,path:'saved'},
    {element:'Paneli' , icon:<FaRegChartBar/>,path:'dashboard'},
    
  ]
  