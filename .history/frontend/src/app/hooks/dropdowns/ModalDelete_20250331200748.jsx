import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const ModalDelete = ({ isOpen, handleDelete, loading, onClose, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); 
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

  return createPortal(
    <div
    className={`fixed z-50 top-0 left-0 w-full  h-screen bg-gray-800 bg-opacity-70 flex justify-center items-center transition-all duration-500 ${
      isClosing ? "animate-fadeOut" : "animate-fadeIn"
    }`}
  >
    <div
      ref={dropdownRef}
      className={`before:absolute p-6 w-full  md:w-[50%]
     dark:bg-gray-800 bg-white before:-z-10 z-30 rounded-lg mt-20 mb-20 shadow-lg ${
        isClosing ? "animate-closeModal" : "animate-openModal"
      }`}
    >
        {/* Close Button */}
        <button
          className="absolute top-0 right-0 p-2 text-gray-500"
          onClick={handleClose}
        >
          Close
        </button>

        {children}

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body // Render at the root level
  );
};

export default ModalDelete;
