import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const ModalDelete = ({ isOpen, handleDelete, loading, onClose, children }) => {
  const modalRef = useRef(null);
  
  // Function to handle the delete action
  const onDeleteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Call the parent component's delete handler
    // This will set loading state and perform the deletion
    if (typeof handleDelete === 'function') {
      await handleDelete();
    }
  };

  // Function to handle the cancel button click
  const onCancelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only allow cancellation if not currently loading
    if (!loading && typeof onClose === 'function') {
      onClose();
    }
  };

  // Close on ESC key press, but only if not loading
  useEffect(() => {
    const handleEscKey = (event) => {
      if (isOpen && !loading && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, loading, onClose]);

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current && 
        !modalRef.current.contains(event.target) && 
        !loading
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, loading, onClose]);

  // Don't render anything if the modal isn't open
  if (!isOpen) {
    return null;
  }

  // Render the modal using a portal to ensure it's at the document root
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="relative w-full max-w-md md:max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="mb-6">
          {children}
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onCancelClick}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition ${
              loading 
                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            Cancel
          </button>
          
          <button
            onClick={onDeleteClick}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition ${
              loading 
                ? "bg-red-500 text-white cursor-wait" 
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
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
    document.body
  );
};

export default ModalDelete;