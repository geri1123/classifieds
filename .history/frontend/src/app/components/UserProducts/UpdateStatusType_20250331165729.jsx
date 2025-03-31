
import { useState } from "react";
import ModalDropdown from "@/hooks/dropdowns/ModalDropdown";
import Button from "@/components/ui/Button";

export default function UpdateStatusType({ product, onStatusUpdated }) {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store error message

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
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to update product status"); // Capture error message
        setShowErrorModal(true); // Show error modal
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      setErrorMessage("An unexpected error occurred. Please try again."); // Generic error message
      setShowErrorModal(true); // Show error modal
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
          The product status has been updated successfully to <strong>{product.status_type}</strong>.{" "}
          {product.status_type === "published"
            ? " Changes will take effect immediately. If you don't see the update, please refresh the page. You can modify the status again at any time."
            : " This product will no longer be visible on your public profile. You can reactivate it whenever you want."}
        </p>
      </ModalDropdown>

      {/* Error Modal */}
      <ModalDropdown isOpen={showErrorModal} onClose={() => setShowErrorModal(false)}>
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Error</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{errorMessage}</p>
      </ModalDropdown>
    </>
  );
}
