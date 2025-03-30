import { useEffect, useState, useRef } from 'react';

const useDropdownId = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is outside both the dropdown and the button
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
        (buttonRef.current && !buttonRef.current.contains(event.target))
      ) {
        setOpenDropdownId(null); // Close the dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id) => {
    // Force close if the same ID is clicked again
    setOpenDropdownId((currentId) => (currentId === id ? null : id));
  };

  return { openDropdownId, setOpenDropdownId, toggleDropdown, dropdownRef, buttonRef };
};

export default useDropdownId;