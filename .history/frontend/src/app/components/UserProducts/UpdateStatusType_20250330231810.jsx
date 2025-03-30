export default function UpdateStatusType({product}){
    const handleStatusChange = async (productId, currentStatus) => {
        const newStatus = currentStatus === "published" ? "draft" : "published";
      
        try {
          const response = await fetch(`/api/update-product-status/${productId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status_type: newStatus }),
          });
      
          if (response.ok) {
            // Update the product status in UI (optional: fetch updated products)
            alert(`Product status updated to ${newStatus}`);
            window.location.reload(); // Reload the page to reflect changes
          } else {
            console.error("Failed to update product status");
          }
        } catch (error) {
          console.error("Error updating product status:", error);
        }
      };
    return(
        <div>
        {product.status_type === "published" ? (
            <button className="border-2 px-2 py-1 rounded border-yellow-400 
                               hover:bg-yellow-400 
                               transition ease-in-out duration-300">
              Deactivate
            </button>
          ) : (
            <button className="border-2 px-2 py-1 rounded border-yellow-400 
                               hover:bg-yellow-400 
                               transition ease-in-out duration-300">
              Publish
            </button>
          )}   
          </div>
    )
}