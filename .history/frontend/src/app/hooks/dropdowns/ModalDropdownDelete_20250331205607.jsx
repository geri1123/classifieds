
// ModalDropdownDelete.js - Save this at @/hooks/dropdowns/ModalDropdownDelete.js
import { useState, useRef, useEffect } from "react";

const ModalDropdownDelete = ({ isOpen, onClose, children, handleDelete, loading }) => {
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); // Close modal after animation is complete
    }, 300); // Delay should match the animation duration
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  
  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false); // Reset closing state when modal is closed
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-80 flex justify-center items-center transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        ref={modalRef}
        className={`w-full h-full flex flex-col items-center justify-center p-4 ${
          isClosing ? "animate-closeModal" : "animate-openModal"
        }`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 md:p-8 max-w-lg w-full text-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalDropdownDelete;