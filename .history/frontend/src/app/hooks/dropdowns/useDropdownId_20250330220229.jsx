// import {useEffect , useState , useRef} from 'react'
// const useDropdownId = () => {
//   const [openDropdownId, setOpenDropdownId] = useState(null);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Check if the click was outside the dropdown
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setOpenDropdownId(null); // Close the dropdown if clicked outside
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const toggleDropdown = (id) => {
//     setOpenDropdownId((currentId) => (currentId === id ? null : id));
//   };

//   const closeDropdown = () => {
//     setOpenDropdownId(null);
//   };

//   return { openDropdownId, toggleDropdown, closeDropdown, dropdownRef };
// };

// export default useDropdownId;
import {useEffect , useState , useRef} from 'react'
const useDropdownId = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click was outside the dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdownId(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdownId((currentId) => (currentId === id ? null : id));
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  return { openDropdownId, toggleDropdown, closeDropdown, dropdownRef };
};

export default useDropdownId;
