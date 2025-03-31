import { useState } from "react";

export default function DeleteProduct({ productId, onProductDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/delete-product/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Ensure the token is stored in localStorage
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      onProductDeleted(productId); // Update UI after successful deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="block w-full text-red-600 px-4 py-2 hover:bg-red-500 hover:text-white"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
