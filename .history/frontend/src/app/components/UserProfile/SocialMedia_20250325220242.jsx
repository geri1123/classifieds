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
        
        // Ensure we have data, otherwise use default empty strings
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
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/social-media`, {
        method: "PUT",  // Change to PUT or POST based on your backend
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify(socialMediaData),
      });

      if (!response.ok) {
        throw new Error("Failed to update social media data");
      }

      setIsOpen(false); // Close modal after successful update
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
        <ModalDropdown isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="modal-content">
            <h2>Edit Social Media</h2>
            <form onSubmit={handleSubmit}>
              <InputField
                label="Instagram"
                name="instagram"
                value={socialMediaData.instagram}
                onChange={handleChange}
              />
              <InputField
                label="Facebook"
                name="facebook"
                value={socialMediaData.facebook}
                onChange={handleChange}
              />
              <InputField
                label="LinkedIn"
                name="linkedin"
                value={socialMediaData.linkedin}
                onChange={handleChange}
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
