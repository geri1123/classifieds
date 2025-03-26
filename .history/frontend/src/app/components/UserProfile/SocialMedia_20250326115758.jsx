import { useEffect, useState } from "react";
import { CgMediaLive } from "react-icons/cg";
import { MdOutlineModeEdit } from "react-icons/md";
import ModalDropdown from "@/hooks/dropdowns/ModalDropdown";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export function SocialMedia({ user, mutate }) {
  const [socialMediaData, setSocialMediaData] = useState({
    instagram: "",
    facebook: "",
    linkedin: "",
    fiverr: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch social media data from the backend
 
  useEffect(() => {
    if (user?.instagrama && user?.facebook && user?.fiverr && user?.linkedin) {
        setSocialMediaData({
            instagram: user.instagram,
            last_name: user.last_name
        });
    }
}, [user]);
  
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setSocialMediaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-social-media`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(socialMediaData),
        }
      );

      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage("Social media updated successfully! ✅");
        mutate(); // Refresh user data after update
        
          
        
      }
    } catch (error) {
      setError("Failed to update social media.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    (!socialMediaData.instagram.trim() &&
      !socialMediaData.facebook.trim() &&
      !socialMediaData.linkedin.trim() &&
      !socialMediaData.fiverr.trim());

  return (
    <div className="social-media flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="flex items-center text-black gap-2 text-lg font-semibold dark:text-gray-200 text-center">
          <CgMediaLive size={18} /> Social Media
        </h2>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center text-blue-600 dark:text-blue-400 ml-4"
        >
          <MdOutlineModeEdit className="text-lg" />
          <p className="text-[10px] ml-1">edit</p>
        </button>
      </div>

      {/* Show Success Message */}
     

     
      {!user.instagram &&
        !user.facebook &&
        !user.linkedin &&
        !user.fiverr && (
          <p className="text-gray-500 text-sm">No social media data available.</p>
        )}

      {/* Display social media data */}
      {socialMediaData && (
        <ul>
          {socialMediaData.instagram && <li>Instagram: {socialMediaData.instagram}</li>}
          {socialMediaData.facebook && <li>Facebook: {socialMediaData.facebook}</li>}
          {socialMediaData.linkedin && <li>LinkedIn: {socialMediaData.linkedin}</li>}
          {socialMediaData.fiverr && <li>Fiverr: {socialMediaData.fiverr}</li>}
        </ul>
      )}

      {/* Modal for editing */}
      <ModalDropdown isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="modal-content">
          <h2 className="dark:text-sky-400 text-sky-800 mb-4 text-xl">Edit Social Media</h2>
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <InputField
              label="Instagram"
              name="instagram"
              value={socialMediaData.instagram}
              onChange={changeHandler}
              placeholder="Enter Instagram URL"
            />
            <InputField
              label="Facebook"
              name="facebook"
              value={socialMediaData.facebook}
              onChange={changeHandler}
              placeholder="Enter Facebook URL"
            />
            <InputField
              label="LinkedIn"
              name="linkedin"
              value={socialMediaData.linkedin}
              onChange={changeHandler}
              placeholder="Enter LinkedIn URL"
            />
            <InputField
              label="Fiverr"
              name="fiverr"
              value={socialMediaData.fiverr}
              onChange={changeHandler}
              placeholder="Enter Fiverr URL"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </ModalDropdown>
    </div>
  );
}
