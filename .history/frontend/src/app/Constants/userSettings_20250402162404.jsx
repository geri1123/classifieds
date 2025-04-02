import { MdOutlineHomeWork } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiHeart } from "react-icons/fi";
import { MdOutlineSaveAlt } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";

export const userSettings=[
    {element:'Profile' , icon:<CgProfile/> ,path:'/profile'},
    {element:'Published', icon:<MdOutlineHomeWork/>,path:'MyPortal/products?category=All'},
    {element:'Favourites' , icon:<FiHeart/> ,path:'favourites'},
    {element:'Saved', icon:<MdOutlineSaveAlt/>,path:'saved'},
    {element:'Panel' , icon:<FaRegChartBar/>,path:'dashboard'},
    
  ]
  