import { useState } from "react";
import ModalDropdown from "@/hooks/dropdowns/ModalDropdown";

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

      if (!response.ok) throw new Error("Failed to delete product");

      onProductDeleted(productId, true); // Notify parent component
      setIsModalOpen(false);
      
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
onClick={handleDelete}
        className="block w-full text-red-600 px-4 py-2 hover:bg-red-500 hover:text-white"
      >
        {loading ?"Deleting...":"Delete"}
      </button>

    </div>
  );
}
