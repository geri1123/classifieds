
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const ModalDelete = ({ isOpen, handleDelete, loading, onClose, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef(null);

  const handleClose = () => {
    // Don't close if loading
    if (loading) return;
    
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
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, loading]);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false); // Reset closing state when modal is closed
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed z-50 top-0 left-0 w-full h-screen bg-gray-800 bg-opacity-70 flex justify-center items-center transition-all duration-500 ${
        isClosing ? "animate-fadeOut" : "animate-fadeIn"
      }`}
    >
      <div
        ref={dropdownRef}
        className={`relative p-6 w-full md:w-[50%] dark:bg-gray-800 bg-white z-30 rounded-lg shadow-lg ${
          isClosing ? "animate-closeModal" : "animate-openModal"
        }`}
      >
        {/* Close Button - disabled during loading */}
        <button
          className={`absolute top-2 right-2 p-2 text-gray-500 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:text-gray-800"
          }`}
          onClick={handleClose}
          disabled={loading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {children}

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className={`px-4 py-2 bg-gray-500 text-white rounded-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 bg-red-600 text-white rounded-lg transition ${
              loading ? "opacity-75" : "hover:bg-red-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body // Render at the root level
  );
};

export default ModalDelete;