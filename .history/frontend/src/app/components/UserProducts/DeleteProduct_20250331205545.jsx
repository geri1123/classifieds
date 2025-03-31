// DeleteProduct.js
import { useState } from "react";
import ModalDropdownDelete from "@/hooks/dropdowns/ModalDropdownDelete";

export default function DeleteProduct({ productId, onProductDeleted }) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/delete-product/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      
      // Call onProductDeleted to update UI after successful deletion
      onProductDeleted(productId);
      
      // Close modal only after successful deletion
      setIsModalOpen(false);
      
    } catch (error) {
      console.error("Error deleting product:", error);
      // You might want to show an error message here
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="w-full">
        <button
          onClick={() => setIsModalOpen(true)}
          className="block w-full text-red-600 px-4 py-2 hover:bg-red-500 hover:text-white"
        >
          Delete
        </button>
      </div>
      
      {isModalOpen && (
        <ModalDropdownDelete
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          handleDelete={handleDelete}
          loading={loading}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Confirm Deletion
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Are you sure you want to delete this product? <br />
            <span className="font-bold">
              All images and product information will be permanently deleted.
            </span>
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              disabled={loading}
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
                "Delete Product"
              )}
            </button>
          </div>
        </ModalDropdownDelete>
      )}
    </div>
  );
}
