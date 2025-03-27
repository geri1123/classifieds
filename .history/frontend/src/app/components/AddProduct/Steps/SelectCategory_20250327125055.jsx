
// "use client";
// import { useEffect, useState } from "react";

// export default function SelectCategory({ formData, changeHandler, setFormData }) {
//     const [categories, setCategories] = useState([]);
//     const [subcategories, setSubcategories] = useState([]);
//     const [subcategoriesItem , setSubcategoriesItem]=useState([]);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
//                 const data = await response.json();
//                 setCategories(data);

//                 // Set default category to "Motors" if found
//                 const motorsCategory = data.find(category => category.name === 'Motors');
//                 if (motorsCategory) {
//                     setFormData((prevData) => ({
//                         ...prevData,
//                         category_id: motorsCategory.id, // Set category_id to the ID of Motors
//                     }));
//                 }
//             } catch (error) {
//                 console.error("Error fetching categories:", error);
//             }
//         };
//         fetchCategories();
//     }, []);

//     // Fetch subcategories when category_id changes
//     useEffect(() => {
//         if (!formData.category_id) return; // No category selected, do nothing

//         const fetchSubcategories = async () => {
//             try {
//                 const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategories`);
//                 const data = await response.json();
//                 setSubcategories(data);
                
//                 setFormData((prevData) => ({ ...prevData, subcategory_id: '' })); // Reset subcategory_id when category changes
//             } catch (error) {
//                 console.error("Error fetching subcategories:", error);
//             }
//         };
//         fetchSubcategories();
//     }, [formData.category_id]);

//     // Fetch child subcategories when subcategory_id changes
//     useEffect(() => {
//         if (!formData.subcategory_id) return; // No subcategory selected, do nothing
    
//         const fetchSubcategoryItems = async () => {
//             try {
//                 const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategory-items/${formData.subcategory_id}`);
//                 const data = await response.json();
//                 setSubcategoriesItem(data);
                
//                 // Reset subcategory_item_id when subcategory changes
//                 setFormData((prevData) => ({ ...prevData, subcategory_item_id: '' }));
//             } catch (error) {
//                 console.error("Error fetching subcategory items:", error);
//             }
//         };
//         fetchSubcategoryItems();
//     }, [formData.subcategory_id]);
 
//     return (
//         <div className="select-category flex flex-col w-screen px-4">
//             <h2>Please select a listing type and category for your listing.</h2>
//             <div className="w-full flex flex-col">
//                 {/* Categories section */}
//                 {categories.length > 0 ? (
//                     categories.map((category) => (
//                         <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
//                             <input
//                                 type="radio"
//                                 name="category_id"
//                                 value={category.id}
//                                 checked={String(formData.category_id) === String(category.id)}
//                                 onChange={changeHandler}
//                                 className="peer hidden" // Hide default radio button
//                             />
//                             <div className="w-5 h-5 border-2 border-gray-500 rounded-full peer-checked:bg-yellow-400"></div>
//                             <span>{category.name}</span>
//                         </label>
//                     ))
//                 ) : (
//                     <p>Loading categories...</p>
//                 )}

//                 {/* Subcategories section */}
//                 {formData.category_id && (
//                     <div className="mt-4">
//                         <h3 className="text-lg font-semibold mb-2">Select subcategory</h3>
//                         <div className="flex flex-wrap items-start gap-3">
//                             {subcategories
//                                 .filter((sub) => String(sub.category_id) === String(formData.category_id) && !sub.parent_id) // Parent subcategories
//                                 .map((sub) => (
//                                     <button
//                                         key={sub.id}
//                                         type="button"
//                                         name="subcategory_id"
//                                         value={sub.id}
//                                         onClick={() => changeHandler({ target: { name: "subcategory_id", value: sub.id } })}
//                                         className={`px-4 py-2 border-2 rounded-lg text-lg cursor-pointer transition-all
//                                             ${formData.subcategory_id === sub.id
//                                                 ? "bg-yellow-400 text-black border-yellow-500"
//                                                 : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                                             }`}
//                                     >
//                                         {sub.name}
//                                     </button>
//                                 ))}
//                         </div>
//                     </div>
//                 )}
// {formData.subcategory_id && subcategoriesItem.length > 0 && (
//     <div className="mt-4">
//         <h3 className="text-lg font-semibold mb-2">Select Subcategory Item</h3>
//         <div className="flex flex-wrap gap-3">
//             {subcategoriesItem.map((item) => (
//                 <button
//                     key={item.id}
//                     type="button"
//                     name="subcategory_item_id"
//                     value={item.id}
//                     onClick={() => changeHandler({ target: { name: "subcategory_item_id", value: item.id } })}
//                     className={`px-4 py-2 border-2 rounded-lg text-lg cursor-pointer transition-all
//                         ${formData.subcategory_item_id === item.id
//                             ? "bg-yellow-400 text-black border-yellow-500"
//                             : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                         }`}
//                 >
//                     {item.name}
//                 </button>
//             ))}
//               <input type="text" name="title" value={formData.title} onChange={changeHandler} placeholder="Title" className="border p-2 w-full rounded mt-2" />
//         </div>
      
//     </div>
// )}
//                 {/* Child subcategories section */}
         
//             </div>
//         </div>
//     );
// }
"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCategories, fetchSubcategories, fetchSubcategoryItems } from "@redux/categorySlice";
export default function SelectCategory({ formData, changeHandler, setFormData }) {
    const dispatch = useDispatch();
    const { categories, subcategories, subcategoriesItem, subcategoriesItem,loading } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (formData.category_id) {
            dispatch(fetchSubcategories());
            setFormData((prevData) => ({ ...prevData, subcategory_id: '' }));
        }
    }, [dispatch, formData.category_id]);

    useEffect(() => {
        if (formData.subcategory_id) {
            dispatch(fetchSubcategoryItems(formData.subcategory_id));
            setFormData((prevData) => ({ ...prevData, subcategory_item_id: '' }));
        }
    }, [dispatch, formData.subcategory_id]);

    return (
        <div className="select-category flex flex-col w-screen px-4">
            <h2>Please select a listing type and category for your listing.</h2>
            <div className="w-full flex flex-col">
                {/* Categories section */}
                {loading ? (
                    <p>Loading categories...</p>
                ) : (
                    categories.map((category) => (
                        <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category_id"
                                value={category.id}
                                checked={String(formData.category_id) === String(category.id)}
                                onChange={changeHandler}
                                className="peer hidden"
                            />
                            <div className="w-5 h-5 border-2 border-gray-500 rounded-full peer-checked:bg-yellow-400"></div>
                            <span>{category.name}</span>
                        </label>
                    ))
                )}

                {/* Subcategories section */}
                {formData.category_id && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Select subcategory</h3>
                        <div className="flex flex-wrap items-start gap-3">
                            {subcategories
                                .filter((sub) => String(sub.category_id) === String(formData.category_id) && !sub.parent_id)
                                .map((sub) => (
                                    <button
                                        key={sub.id}
                                        type="button"
                                        name="subcategory_id"
                                        value={sub.id}
                                        onClick={() => changeHandler({ target: { name: "subcategory_id", value: sub.id } })}
                                        className={`px-4 py-2 border-2 rounded-lg text-lg cursor-pointer transition-all
                                            ${formData.subcategory_id === sub.id
                                                ? "bg-yellow-400 text-black border-yellow-500"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {sub.name}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

                {/* Subcategory Items section */}
                {formData.subcategory_id && subcategoriesItem.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Select Subcategory Item</h3>
                        <div className="flex flex-wrap gap-3">
                            {subcategoriesItem.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    name="subcategory_item_id"
                                    value={item.id}
                                    onClick={() => changeHandler({ target: { name: "subcategory_item_id", value: item.id } })}
                                    className={`px-4 py-2 border-2 rounded-lg text-lg cursor-pointer transition-all
                                        ${formData.subcategory_item_id === item.id
                                            ? "bg-yellow-400 text-black border-yellow-500"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                           
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
