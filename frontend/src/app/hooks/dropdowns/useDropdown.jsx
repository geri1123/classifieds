
"use client"
import { useState, useRef, useEffect } from "react";
const useDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dropdownRef = useRef(null);
  
    const toggleDropdown = () => {
      if (isOpen) {
        closeDropdown();
      } else {
        setIsOpen(true);
      }
    };
  
    const closeDropdown = () => {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 500);
    };
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          closeDropdown();
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    return { isOpen, isClosing, toggleDropdown, closeDropdown, dropdownRef };
  };
  
  export default useDropdown;