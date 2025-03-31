import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";

const ModalDropdownDelete = ({ isOpen, onClose, confirm, children }) => {
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
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-80 transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-md mx-4 md:mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="p-6">
          {/* Close button at top right */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          {/* Modal content */}
          {children}
          
          {/* This is optional if you want to keep the button from props, otherwise remove it */}
          {/* <Button onClick={confirm} /> */}
        </div>
      </div>
    </div>
  );
};

export default ModalDropdownDelete;