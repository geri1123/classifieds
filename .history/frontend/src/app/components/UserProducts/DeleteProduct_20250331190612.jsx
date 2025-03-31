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

      onProductDeleted(productId); // Update UI after successful deletion
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsModalOpen(true)}
        className="block w-full text-left text-red-600 px-4 py-2 hover:bg-red-500 hover:text-white transition-colors duration-200"
      >
        Delete
      </button>

      {isModalOpen && (
        <ModalDropdownDelete
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          confirm={handleDelete}
        >
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this product?
              <br />
              <span className="font-bold block mt-2">
                All images and product information will be permanently deleted.
              </span>
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </ModalDropdownDelete>
      )}
    </div>
  );
}