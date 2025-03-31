import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";

const ModalDropdownDelete = ({ isOpen, onClose, confirm, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); // Close modal after animation is complete
    }, 300);
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
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-70 transition-all duration-500 ${
        isClosing ? "animate-fadeOut" : "animate-fadeIn"
      }`}
    >
      <div
        ref={dropdownRef}
        className={`relative p-6 w-full max-w-lg dark:bg-gray-800 bg-white rounded-lg shadow-lg ${
          isClosing ? "animate-closeModal" : "animate-openModal"
        }`}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Are you sure you want to delete this product? <br />
          <span className="font-bold">All images and product information will be permanently deleted.</span>
        </p>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <Button onClick={confirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalDropdownDelete;
