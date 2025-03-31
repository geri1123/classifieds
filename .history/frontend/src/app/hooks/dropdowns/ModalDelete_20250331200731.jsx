import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const ModalDelete = ({ isOpen, handleDelete, loading, onClose, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(isOpen);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true); // Keep the modal mounted when open
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsMounted(false);
      onClose(); // Call onClose after animation finishes
    }, 300); // Animation duration should match CSS
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isMounted) return null; // Only render when mounted

  return createPortal(
    <div
      className={`fixed z-50 top-0 left-0 w-full h-screen bg-gray-800 bg-opacity-70 flex justify-center items-center transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        ref={modalRef}
        className={`before:absolute p-6 w-full md:w-[50%] dark:bg-gray-800 bg-white before:-z-10 z-30 rounded-lg mt-20 mb-20 shadow-lg transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-red-500"
          onClick={handleClose}
        >
          ✕
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
    document.body // Ensures modal is outside dropdown constraints
  );
};

export default ModalDelete;
