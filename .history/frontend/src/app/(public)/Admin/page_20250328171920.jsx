
// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function ManageAttributes() {
//     const [categories, setCategories] = useState([]);
//     const [subcategories, setSubcategories] = useState([]);
//     const [newCategory, setNewCategory] = useState("");
//     const [newSubcategory, setNewSubcategory] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [selectedParentSubcategory, setSelectedParentSubcategory] = useState("");
//     const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
//     const [subcategoryErrorMessage, setSubcategoryErrorMessage] = useState("");
//     const [atributeErrorMessage , setAttributeErrorMessage]=useState('');
//     const [attributes, setAttributes] = useState([]);
//     const [newAttribute, setNewAttribute] = useState("");
//     const [selectedParentSubcaategoryAtt, setSelectedParentSubcategoryAtt] = useState("");
//     const [selectedCategoryatt, setSelectedCategoryatt] = useState("");
//     const [subcategoryItems, setSubcategoryItems] = useState([]);

// const [selectedCategoryForSubItem, setSelectedCategoryForSubItem] = useState("");
// const [selectedSubcategoryForItem, setSelectedSubcategoryForItem] = useState("");
// const [newSubcategoryItem, setNewSubcategoryItem] = useState("");
//     // Fetch categories
//     async function fetchCategories() {
//         try {
//             const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
//             setCategories(response.data);
//         } catch (error) {
//             console.error("Error fetching categories:", error);
//         }
//     }
//     async function fetchSubcategoryItems() {
//         try {
//             const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategory-items`);
//             setSubcategoryItems(response.data);
//         } catch (error) {
//             console.error("Error fetching subcategory items:", error);
//         }
//     }

//     // Fetch subcategories
//     async function fetchSubcategories() {
//         try {
//             const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategories`);
//             setSubcategories(response.data);
//         } catch (error) {
//             console.error("Error fetching subcategories:", error);
//         }
//     }

//     async function addCategory() {
//         if (!newCategory.trim()) {
//             setCategoryErrorMessage("Category name is required!");
//             return;
//         }
    
//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`, {
//                 name: newCategory, // Only sending the category name
//             });
    
//             const newCat = { id: response.data.categoryId, name: newCategory };
//             setCategories([...categories, newCat]); // Update UI
//             setNewCategory("");
//             setCategoryErrorMessage("");
//         } catch (error) {
//             setCategoryErrorMessage(error.response?.data?.error || "Error adding category.");
//         }
//     }
//     async function addAttribute() {
     
//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/AddAttributes`, {
//                 name: newAttribute,
//                 subcategory_id:selectedParentSubcaategoryAtt ,
//             });

//             const newAttr = { id: response.data.attributeId, name: newAttribute };
//             setAttributes([...attributes, newAttr]); // Update UI
//             setNewAttribute("");
//             setAttributeErrorMessage("");
//         } catch (error) {
//             setAttributeErrorMessage(error.response?.data?.error || "Error adding attribute.");
//         }
//     }
//     async function addSubcategory() {
//         if (!newSubcategory.trim() || (!selectedCategory && !selectedParentSubcategory)) {
//             setSubcategoryErrorMessage("You must select a category !");
//             return;
//         }
    
//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategory`, {
//                 name: newSubcategory,
//                 category_id: selectedCategory || null,
               
//             });
    
//             const newSubcat = { 
//                 id: response.data.subcategoryId, 
//                 name: newSubcategory, 
//                 category_id: selectedCategory, 
        
//             };
            
//             setSubcategories([...subcategories, newSubcat]);
            
//             // Reset form fields
//             setNewSubcategory("");
//             setSelectedCategory("");
//             setSelectedParentSubcategory("");
//             setSubcategoryErrorMessage("");
    
//             fetchSubcategories(); // Refresh the subcategories list
//         } catch (error) {
//             setSubcategoryErrorMessage(error.response?.data?.error || "Error adding subcategory.");
//         }
//     }
//     async function addSubcategoryItem() {
//         if (!newSubcategoryItem.trim() || !selectedSubcategoryForItem) {
//             alert("Please select a subcategory and enter an item name.");
//             return;
//         }
    
//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategory-item`, {
//                 name: newSubcategoryItem,
//                 subcategory_id: selectedSubcategoryForItem,
//             });
    
//             setNewSubcategoryItem("");
//             setSelectedSubcategoryForItem("");
    
//             // 🔥 Fetch latest subcategory items to update UI dynamically
//             await fetchSubcategoryItems();  
//         } catch (error) {
//             alert(error.response?.data?.error || "Error adding subcategory item.");
//         }
//     }
   
//     useEffect(() => {
//         fetchCategories();
//         fetchSubcategories();
//         fetchSubcategoryItems(); 
//     }, []);

//     return (
//         <div className="p-6 max-w-5xl mx-auto">
//             <h1 className="text-2xl font-bold mb-4 text-center">Manage Categories & Subcategories</h1>

//             {/* Category & Subcategory Form */}
//             <div className="grid grid-cols-2 gap-6">
//                 {/* Add Category Form */}
//                 <div className="bg-gray-100 p-4 rounded-lg shadow">
//                     <h2 className="text-lg font-semibold mb-2">Add Category</h2>
//                     <input
//                         type="text"
//                         className="border p-2 w-full rounded"
//                         placeholder="Category Name"
//                         value={newCategory}
//                         onChange={(e) => setNewCategory(e.target.value)}
//                     />
//                     {categoryErrorMessage && <p className="text-red-500 text-sm mt-1">{categoryErrorMessage}</p>}
//                     <button
//                         onClick={addCategory}
//                         className="bg-blue-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-blue-600"
//                     >
//                         Add Category
//                     </button>
//                 </div>

//                 {/* Add Subcategory Form */}
//                 <div className="bg-gray-100 p-4 rounded-lg shadow">
//                     <h2 className="text-lg font-semibold mb-2">Add Subcategory</h2>
//                     <select
//                         className="border p-2 w-full rounded"
//                         value={selectedCategory}
//                         onChange={(e) => {
//                             setSelectedCategory(e.target.value);
//                             setSelectedParentSubcategory(""); // Reset parent subcategory when category changes
//                         }}
//                     >
//                         <option value="">Select Category</option>
//                         {categories.map((category) => (
//                             <option key={category.id} value={category.id}>
//                                 {category.name}
//                             </option>
//                         ))}
//                     </select>

//                     {/* Parent Subcategory selection */}
                   

//                     <input
//                         type="text"
//                         className="border p-2 w-full rounded mt-2"
//                         placeholder="Subcategory Name "
//                         value={newSubcategory}
//                         onChange={(e) => setNewSubcategory(e.target.value)}
//                     />
                    
//                     {subcategoryErrorMessage && <p className="text-red-500 text-sm mt-1">{subcategoryErrorMessage}</p>}
                    
                  
//                     <button
//                         onClick={addSubcategory}
//                         className="bg-green-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-green-600"
//                     >
//                         Add Subcategory
//                     </button>
//                 </div>
//                 <div className="bg-gray-100 p-4 rounded-lg shadow">
//     <h2 className="text-lg font-semibold mb-2">Add Subcategory Item</h2>

//     {/* Select Category First */}
//     <select
//         className="border p-2 w-full rounded"
//         value={selectedCategoryForSubItem}
//         onChange={(e) => {
//             setSelectedCategoryForSubItem(e.target.value);
//             setSelectedSubcategoryForItem(""); // Reset subcategory selection
//         }}
//     >
//         <option value="">Select Category</option>
//         {categories.map((category) => (
//             <option key={category.id} value={category.id}>
//                 {category.name}
//             </option>
//         ))}
//     </select>

//     {/* Select Subcategory based on Selected Category */}
//     {selectedCategoryForSubItem && (
//         <select
//             className="border p-2 w-full rounded mt-2"
//             value={selectedSubcategoryForItem}
//             onChange={(e) => setSelectedSubcategoryForItem(e.target.value)}
//         >
//             <option value="">Select Subcategory</option>
//             {subcategories
//                 .filter((sub) => String(sub.category_id) === String(selectedCategoryForSubItem))
//                 .map((sub) => (
//                     <option key={sub.id} value={sub.id}>
//                         {sub.name}
//                     </option>
//                 ))}
//         </select>
//     )}

//     <input
//         type="text"
//         className="border p-2 w-full rounded mt-2"
//         placeholder="Subcategory Item Name"
//         value={newSubcategoryItem}
//         onChange={(e) => setNewSubcategoryItem(e.target.value)}
//     />

//     <button
//         onClick={addSubcategoryItem}
//         className="bg-blue-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-blue-600"
//     >
//         Add Subcategory Item
//     </button>
// </div>
//                 <div className="bg-gray-100 p-4 rounded-lg shadow">
//                     <h2 className="text-lg font-semibold mb-2">Add Attribute</h2>
//                     <select
//                         className="border p-2 w-full rounded"
//                         value={selectedCategoryatt}
//                         onChange={(e) => {
//                             setSelectedCategoryatt(e.target.value);
//                             setSelectedParentSubcategoryAtt(""); // Reset parent subcategory when category changes
//                         }}
//                     >
//                         <option value="">Select Category</option>
//                         {categories.map((category) => (
//                             <option key={category.id} value={category.id}>
//                                 {category.name}
//                             </option>
//                         ))}
//                     </select>

//                     {/* Parent Subcategory selection */}
//                     {selectedCategoryatt && (
//                         <select
//                             className="border p-2 w-full rounded mt-2"
//                             value={selectedParentSubcaategoryAtt}
//                             onChange={(e) => setSelectedParentSubcategoryAtt(e.target.value)}
//                         >
//                             <option value="">Select Parent Subcategory</option>
//                             {subcategories
//                                 .filter(sub => String(sub.category_id) === String(selectedCategoryatt) && !sub.parent_id)
//                                 .map(sub => (
//                                     <option key={sub.id} value={sub.id}>
//                                         {sub.name}
//                                     </option>
//                                 ))}
//                         </select>
//                     )}

              
                    
//                   {selectedParentSubcaategoryAtt &&  <input
//                         type="text"
//                         className="border p-2 w-full rounded mt-2"
//                         placeholder="Atribute name  (for example if subcategory is car will be fuel ) "
//                         value={newAttribute}
//                         onChange={(e) => setNewAttribute(e.target.value)}
//                     />}
//                     {atributeErrorMessage && <p className="text-red-500 text-sm mt-1">{atributeErrorMessage}</p>}
//                     <button
//                         onClick={addAttribute}
//                         className="bg-green-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-green-600"
//                     >
//                         Add Attribute
//                     </button>
//                 </div>
//             </div>
            

//             {/* Category Grid Display */}
//           {/* Category Grid Display */}
// <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
//     {categories.map((category) => (
//         <div key={category.id} className="bg-gray-100 p-4 max-h-[300px] overflow-y-auto rounded-lg shadow">
//             <h2 className="text-lg font-bold mb-2">📂 {category.name}</h2>

//             {/* Display Top-Level Subcategories */}
//             <ul className="ml-4 list-disc">
//                 {subcategories
//                     .filter(sub => sub.category_id === category.id)
//                     .map(sub => (
//                         <li key={sub.id} className="font-semibold">
//                             📁 {sub.name}

//                             {/* Display Subcategory Items */}
//                             <ul className="ml-6 list-disc text-sm text-gray-600">
//                                 {subcategoryItems
//                                     .filter(item => item.subcategory_id === sub.id)
//                                     .map(item => (
//                                         <li key={item.id}>📝 {item.name}</li>
//                                     ))}
//                             </ul>
//                         </li>
//                     ))}
//             </ul>
//         </div>
//     ))}
// </div>

//         </div>
//     );
// }
import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageAttributes() {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [attributes, setAttributes] = useState({});
    const [newAttribute, setNewAttribute] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
    const [subcategoryErrorMessage, setSubcategoryErrorMessage] = useState("");
    const [attributeErrorMessage, setAttributeErrorMessage] = useState("");

    // Fetch categories
    async function fetchCategories() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    // Fetch subcategories
    async function fetchSubcategories() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategories`);
            setSubcategories(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    }

    // Fetch attributes for the selected subcategory
    async function fetchAttributesForSubcategory(subcategoryId) {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/attributes/${subcategoryId}`);
            setAttributes((prevAttributes) => ({
                ...prevAttributes,
                [subcategoryId]: response.data,
            }));
        } catch (error) {
            console.error("Error fetching attributes:", error);
        }
    }

    // Add attribute to selected subcategory
    async function addAttribute() {
        if (!newAttribute.trim() || !selectedSubcategory) {
            setAttributeErrorMessage("You must select a subcategory and provide an attribute name.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/AddAttributes`, {
                name: newAttribute,
                subcategory_id: selectedSubcategory,
            });

            const newAttr = { id: response.data.attributeId, name: newAttribute };
            setAttributes((prevAttributes) => {
                const updatedAttributes = prevAttributes[selectedSubcategory] || [];
                return {
                    ...prevAttributes,
                    [selectedSubcategory]: [...updatedAttributes, newAttr],
                };
            });

            setNewAttribute("");
            setAttributeErrorMessage("");
        } catch (error) {
            setAttributeErrorMessage(error.response?.data?.error || "Error adding attribute.");
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Manage Categories & Subcategories</h1>

            {/* Category and Subcategory Forms */}
            <div className="grid grid-cols-2 gap-6">
                {/* Add Category Form */}
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Add Category</h2>
                    {/* Add your form logic for categories */}
                </div>

                {/* Add Subcategory Form */}
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Add Subcategory</h2>
                    {/* Add your form logic for subcategories */}
                </div>
            </div>

            {/* Add Attribute Section */}
            <div className="bg-gray-100 p-4 rounded-lg shadow mt-6">
                <h2 className="text-lg font-semibold mb-2">Add Attribute</h2>

                {/* Select Subcategory for Attribute */}
                <select
                    className="border p-2 w-full rounded"
                    value={selectedSubcategory}
                    onChange={(e) => {
                        const subcategoryId = e.target.value;
                        setSelectedSubcategory(subcategoryId);
                        fetchAttributesForSubcategory(subcategoryId); // Fetch attributes for selected subcategory
                    }}
                >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                            {sub.name}
                        </option>
                    ))}
                </select>

                {/* Display Existing Attributes for the Selected Subcategory */}
                {selectedSubcategory && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-sm">Existing Attributes</h3>
                        <ul>
                            {(attributes[selectedSubcategory] || []).map((attribute) => (
                                <li key={attribute.id}>{attribute.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Attribute Input */}
                {selectedSubcategory && (
                    <div className="mt-4">
                        <input
                            type="text"
                            className="border p-2 w-full rounded"
                            placeholder="Attribute name"
                            value={newAttribute}
                            onChange={(e) => setNewAttribute(e.target.value)}
                        />
                        {attributeErrorMessage && (
                            <p className="text-red-500 text-sm mt-1">{attributeErrorMessage}</p>
                        )}
                        <button
                            onClick={addAttribute}
                            className="bg-green-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-green-600"
                        >
                            Add Attribute
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
