export default function UpdateStatusType({ product }) {
    const handleStatusChange = async () => {
      const newStatus = product.status_type === "published" ? "draft" : "published";
  
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-product-status/${product.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status_type: newStatus }),
          }
        );
  
        if (response.ok) {
          alert(`Product status updated to ${newStatus}`);
          window.location.reload(); // Refresh the UI to reflect changes
        } else {
          console.error("Failed to update product status");
        }
      } catch (error) {
        console.error("Error updating product status:", error);
      }
    };
  
    return (
      <button
        onClick={handleStatusChange}
        className={`border-2 px-2 py-1 rounded transition ease-in-out duration-300 ${
          product.status_type === "published"
            ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        }`}
      >
        {product.status_type === "published" ? "Deactivate" : "Activate"}
      </button>
    );
  }