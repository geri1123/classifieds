import { MdOutlineHomeWork } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiHeart } from "react-icons/fi";
import { MdOutlineSaveAlt } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";

import { GoBellFill } from "react-icons/go";
export const userSettings=[
  {element:'Notifications' , icon:<GoBellFill/> ,path:'/MyPortal//notifications'},
    {element:'Profile' , icon:<CgProfile/> ,path:'/MyPortal//profile'},
    {element:'Your Products', icon:<MdOutlineHomeWork/>,path:'/MyPortal//products?category=All'},
    {element:'Post an Add' , icon:<MdOutlineAddCircleOutline/> ,path:'/Post'},
    {element:'Favourites' , icon:<FiHeart/> ,path:'favourites'},
    {element:'Saved', icon:<MdOutlineSaveAlt/>,path:'saved'},
    // {element:'Panel' , icon:<FaRegChartBar/>,path:'dashboard'},
    
  ]
  