"use client";
import { useEffect, useState } from "react";

export default function SelectCategory({ formData, changeHandler }) {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
                const data = await response.json();
                setCategories(data);
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
        <div className="select-category">
            <h2>Select Category</h2>
            {categories.length > 0 ? (
                categories.map((category) => (
                    // <label key={category.id}>
                    //     <input
                    //         type="radio" // 🔹 Use radio button instead of checkbox (allows only one selection)
                    //         name="category_id"
                    //         value={category.id}
                    //         checked={String(formData.category_id) === String(category.id)} // 🔹 Ensure it stays checked
                    //         onChange={changeHandler} // 🔹 Updates formData
                    //     />
                    //     {category.name}
                    // </label>
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
                    <h3>Parent Subcategories</h3>
                    <select name="subcategory_id" onChange={changeHandler}>
                        <option value="">Select a subcategory</option>
                        {subcategories
                            .filter((sub) => String(sub.category_id) === String(formData.category_id) && !sub.parent_id)
                            .map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                    </select>
                </div>
            )}
        </div>
    );
}
