
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

      // Only update UI after successful deletion
      onProductDeleted(productId);
      
      // Now we can safely close the modal
      setIsModalOpen(false);
      
    } catch (error) {
      console.error("Error deleting product:", error);
      // You might want to show an error message here
    } finally {
      setLoading(false);
    }
  };

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal - this should only be called when not loading
  const closeModal = () => {
    if (!loading) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={openModal}
        className="block w-full text-red-600 px-4 py-2 hover:bg-red-500 hover:text-white"
      >
        Delete
      </button>

      <ModalDelete
        isOpen={isModalOpen}
        handleDelete={handleDelete}  // Pass the actual deletion function
        loading={loading}
        onClose={closeModal}         // Pass the close modal function
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
    </div>
  );
}