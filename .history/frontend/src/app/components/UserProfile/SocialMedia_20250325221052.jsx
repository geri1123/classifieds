import ModalDropdown from "@/hooks/dropdowns/ModalDropdown";
import { useState, useEffect } from "react";
import { CgMediaLive } from "react-icons/cg";
import { MdOutlineModeEdit } from "react-icons/md";
import InputField from "@/components/ui/InputField";
import Button from "../ui/Button";

export function SocialMedia() {
  const [isOpen, setIsOpen] = useState(false);
  const [socialMediaData, setSocialMediaData] = useState({
    instagram: "",
    facebook: "",
    linkedin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  // Fetch data from the backend API
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/social-media`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch social media data");
        }
        const data = await response.json();
        
        setSocialMediaData({
          instagram: data?.instagram || "",
          facebook: data?.facebook || "",
          linkedin: data?.linkedin || "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialMediaData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (Update data)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(""); // Clear any previous success message

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/add-social-media`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify(socialMediaData),
      });

      if (!response.ok) {
        throw new Error("Failed to update social media data");
      }

      setSuccessMessage("Social media updated successfully! ✅"); // Show success message
      setIsOpen(false); // Close modal

      setTimeout(() => {
        setSuccessMessage(""); // Remove message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error updating social media:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="social-media flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="flex items-center text-black gap-2 text-lg font-semibold dark:text-gray-200 text-center">
          <CgMediaLive size={18} /> Social Media
        </h2>
        <button onClick={() => setIsOpen(true)} className="flex items-center text-blue-600 dark:text-blue-400 ml-4">
          <MdOutlineModeEdit className="text-lg" />
          <p className="text-[10px] ml-1">edit</p>
        </button>
      </div>

      {/* Show Success Message */}
    

      {/* Loading state */}
      {loading && <p>Loading...</p>}

      {/* Error state */}
      {error && <p className="text-red-500">{error}</p>}

      {/* No data available */}
      {!socialMediaData.instagram && !socialMediaData.facebook && !socialMediaData.linkedin && (
        <p className="text-gray-500 text-sm">No social media data available.</p>
      )}

      {/* Display social media data */}
      {socialMediaData && (
        <ul>
          {socialMediaData.instagram && <li>Instagram: {socialMediaData.instagram}</li>}
          {socialMediaData.facebook && <li>Facebook: {socialMediaData.facebook}</li>}
          {socialMediaData.linkedin && <li>LinkedIn: {socialMediaData.linkedin}</li>}
        </ul>
      )}

      {/* Modal for editing */}
      {isOpen && (
        <ModalDropdown isOpen={isOpen} onClose={() => {setIsOpen(false); setSuccessMessage('')}}>
          <div className="modal-content">
            <h2>Edit Social Media</h2>
            {successMessage && (
        <p className="text-green-500 text-sm">{successMessage}</p>
      )}
            <form onSubmit={handleSubmit}>
              <InputField
                label="Instagram"
                name="instagram"
                value={socialMediaData.instagram}
                onChange={handleChange}
                placeholder="Enter Instagram URL"
              />
              <InputField
                label="Facebook"
                name="facebook"
                value={socialMediaData.facebook}
                onChange={handleChange}
                placeholder="Enter Facebook URL"
              />
              <InputField
                label="LinkedIn"
                name="linkedin"
                value={socialMediaData.linkedin}
                onChange={handleChange}
                placeholder="Enter Linkedin Url"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </form>
          </div>
        </ModalDropdown>
      )}
    </div>
  );
}
