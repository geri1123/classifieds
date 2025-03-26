"use client";
import { useEffect, useState } from "react";

export default function SelectCategory({ formData, changeHandler  , setFormData}) {
    const [categories, setCategories] = useState(null);
    const [subcategories, setSubcategories] = useState(null);
    const [loading  , setLoading]=useState(false);
   
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
                const data = await response.json();
                setCategories(data);

                // Set default category to "Motors" if found
                const motorsCategory = data.find(category => category.name === 'Motors');
                if (motorsCategory) {
                    setFormData((prevData) => ({
                        ...prevData,
                        category_id: motorsCategory.id, // Set category_id to the ID of Motors
                    }));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } 
        };
        fetchCategories();
    }, []);

    // Fetch subcategories when category_id changes
    useEffect(() => {
        if (!formData.category_id) return; // No category selected, do nothing

        const fetchSubcategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategories`);
                const data = await response.json();
                setSubcategories(data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };
        fetchSubcategories();
    }, [formData.category_id]); // Fetch subcategories when category changes

    return (
        <div className="select-category flex flex-col w-full ">
            <h2>Please select a listing type and category for your listing.</h2>
            <div>
            {categories.length > 0 ? (
                categories.map((category) => (
                   
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
    <input
        type="radio"
        name="category_id"
        value={category.id}
        checked={String(formData.category_id) === String(category.id)}
        onChange={changeHandler}
        className="peer hidden" // Hide default radio button
    />
    <div className="w-5 h-5 border-2 border-gray-500 rounded-full peer-checked:bg-yellow-400"></div>
    <span>{category.name}</span>
</label>
                ))
            ) : (
                <p>Loading categories...</p>
            )}

            {/* Show subcategories when a category is selected */}
            {formData.category_id && (
    <div>
        <h3 className="text-lg font-semibold mb-2">Select subcategory</h3>
        <div className="flex flex-wrap gap-3">
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
                        ${
                            formData.subcategory_id === sub.id
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

</div>
        </div>
    );
}
 // Fetch categories
    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
    //             const data = await response.json();
    //             setCategories(data);
    //         } catch (error) {
    //             console.error("Error fetching categories:", error);
    //         }
    //     };
    //     fetchCategories();
    // }, []);