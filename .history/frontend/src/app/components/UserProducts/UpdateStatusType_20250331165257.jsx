// import { useState } from 'react';


// export default function UpdateStatusType({ product, onStatusUpdated }) {
//   const [loading, setLoading] = useState(false);
  
//   const handleStatusChange = async () => {
//     const newStatus = product.status_type === "published" ? "draft" : "published";
//     setLoading(true);

//     try {
//       // Get the token from localStorage or your auth context
// n
      
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-product-status/${product.id}`,
//         {
//           method: "PUT",
//          credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
         
//           },
//           body: JSON.stringify({ status_type: newStatus }),
//         }
//       );

//       if (response.ok) {
//         const result = await response.json();
//         // If you passed a callback, use it instead of forcing a page reload
//         if (onStatusUpdated) {
//           onStatusUpdated(product.id, newStatus);
//         } else {
//           // Option 1: Show confirmation and reload
//           alert(`Product status updated to ${newStatus}`);
//           // More elegant than window.location.reload()
          
//           // Option 2: Redirect to refresh the data
//           // router.push(router.asPath);
//         }
//       } else {
//         const errorData = await response.json();
//         console.error("Failed to update product status:", errorData);
//         alert(`Error: ${errorData.error || 'Failed to update product status'}`);
//       }
//     } catch (error) {
//       console.error("Error updating product status:", error);
//       alert("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleStatusChange}
//       disabled={loading}
//       className={`border-2 px-2 py-1 rounded transition ease-in-out duration-300 ${
//         product.status_type === "published"
//           ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
//           : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
//       }`}
//     >
//       {loading 
//         ? "Updating..." 
//         : product.status_type === "published" 
//           ? "Deactivate" 
//           : "Activate"}
//     </button>
//   );
// }
import { useState } from 'react';
import ModalDropdown from '@/hooks/dropdowns/ModalDropdown';
import Button from '@/components/ui/Button';

export default function UpdateStatusType({ product, onStatusUpdated }) {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal state

  const handleStatusChange = async () => {
    const newStatus = product.status_type === "published" ? "draft" : "published";
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-product-status/${product.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status_type: newStatus }),
        }
      );

      if (response.ok) {
        onStatusUpdated(product.id, newStatus);
        setShowSuccessModal(true); // Show success modal
      } else {
        alert("Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Error updating status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleStatusChange}
        disabled={loading}
        className={`border-2 px-2 py-1 rounded transition ease-in-out duration-300 ${
          product.status_type === "published"
            ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        }`}
      >
        {loading ? "Updating..." : product.status_type === "published" ? "Deactivate" : "Activate"}
      </button>

      {/* Success Modal */}
      <ModalDropdown isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Status Updated</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
  The product status has been updated successfully to <strong>{product.status_type}</strong>.  
  {product.status_type === "published" ? (
    " Changes will take effect immediately. If you don't see the update, please refresh the page. You can modify the status again at any time."
  ) : (
    " This product will no longer be visible on your public profile. You can reactivate it whenever you want."
  )}
</p>


        
      
      </ModalDropdown>
    </>
  );
}