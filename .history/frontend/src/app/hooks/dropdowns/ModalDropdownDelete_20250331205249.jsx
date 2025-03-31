
// Fullscreen Delete Modal Component
function ModalDropdownDelete({ isOpen, onClose, handleDelete, loading }) {
  const [isClosing, setIsClosing] = useState(false);
  
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); // Close modal after animation is complete
    }, 300); // Delay should match the animation duration
  };
  
  if (!isOpen) return null;
  
  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-90 flex flex-col justify-center items-center transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Confirm Deletion
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Are you sure you want to delete this product? <br />
            <span className="font-bold">
              All images and product information will be permanently deleted.
            </span>
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={closeModal}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete Product"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}