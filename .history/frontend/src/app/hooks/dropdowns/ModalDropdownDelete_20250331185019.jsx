import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
const ModalDropdownDelete = ({ isOpen, onClose,confirm, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); // Close modal after animation is complete
    }, 300); // Delay should match the animation duration
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false); // Reset closing state when modal is closed
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 top-0 left-0 w-full  h-screen bg-gray-800 bg-opacity-70 flex justify-center items-center transition-all duration-500 ${
        isClosing ? "animate-fadeOut" : "animate-fadeIn"
      }`}
    >
      <div
        ref={dropdownRef}
        className={`fixed z-50 top-0 left-0 w-full  h-screen bg-gray-800 bg-opacity-70 flex justify-center items-center transition-all duration-500 ${
            isClosing ? "animate-fadeOut" : "animate-fadeIn"
          }`}
      >
        <Button onClick={confirm}/>
        <button
          className="absolute top-0 right-0 p-2 text-gray-500"
          onClick={handleClose}
        >
          Cancel
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalDropdownDelete;
