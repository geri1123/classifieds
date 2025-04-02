import { MdOutlineHomeWork } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiHeart } from "react-icons/fi";
import { MdOutlineSaveAlt } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
export const userSettings=[
  {element:'Favourites' , icon:<FiHeart/> ,path:'favourites'},
    {element:'Profile' , icon:<CgProfile/> ,path:'/profile'},
    {element:'Published', icon:<MdOutlineHomeWork/>,path:'/products?category=All'},
    
    {element:'Saved', icon:<MdOutlineSaveAlt/>,path:'saved'},
    {element:'Panel' , icon:<FaRegChartBar/>,path:'dashboard'},
    
  ]
  