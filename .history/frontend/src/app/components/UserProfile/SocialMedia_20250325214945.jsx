import { useState, useEffect } from "react";
import { CgMediaLive } from "react-icons/cg";
import { MdOutlineModeEdit } from "react-icons/md";

export function SocialMedia() {
  const [isOpen, setIsOpen] = useState(false);
  const [socialMediaData, setSocialMediaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend API
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/social-media`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
            // Authorization: `Bearer ${yourToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch social media data");
        }
        const data = await response.json();
        setSocialMediaData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

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
      {error && <p>Error: {error}</p>}

      {/* No data available */}
     
        {!socialMediaData?.instagram && !socialMediaData?.facebook  (
          <p className="text-gray-500 text-sm">No social media data available.</p>
        )}
      {/* Display social media data */}
     
    </div>
  );
}
