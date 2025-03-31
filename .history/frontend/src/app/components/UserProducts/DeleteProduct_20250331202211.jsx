import { useState } from "react";
import ModalDelete from "@/hooks/dropdowns/ModalDelete";

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
    <div className="w-full">
      <button
        onClick={() => setIsModalOpen(true)}
        className="block w-full text-red-600 px-4 py-2 hover:bg-red-500 hover:text-white"
      >
        Delete
      </button>

      {isModalOpen && (
        <ModalDelete
          isOpen={isModalOpen}
          handleDelete={handleDelete}
          loading={loading}
          onClose={() => {
            // Only allow closing if not currently loading
            
          }}
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
        </ModalDelete>
      )}
    </div>
  );
}