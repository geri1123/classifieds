"use client";
import { useEffect, useState } from "react";

export default function SelectCategory({ formData, changeHandler }) {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    // Fetch categories from backend
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

    // Fetch subcategories when categories change
    useEffect(() => {
        if (formData.category_id.length === 0) return;

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
    }, [formData.category_id]); // 🔹 Runs whenever category selection changes

    return (
        <div className="select-category">
            <h2>Select Category</h2>
            {categories.length > 0 ? (
                categories.map((category) => (
                    <label key={category.id}>
                        <input
                            type="checkbox"
                            name="category_id"
                            value={category.id}
                            checked={formData.category_id.includes(String(category.id))} // 🔹 Ensures checkboxes stay checked
                            onChange={changeHandler} // 🔹 Use the passed function directly
                        />
                        {category.name}
                    </label>
                ))
            ) : (
                <p>Loading categories...</p>
            )}

            {/* Show subcategories for selected categories */}
            {formData.category_id.length > 0 && (
                <div>
                    <h3>Parent Subcategories</h3>
                    <select name="subcategory_id" onChange={changeHandler}>
                        <option value="">Select a subcategory</option>
                        {subcategories
                            .filter((sub) => 
                                formData.category_id.includes(String(sub.category_id)) && !sub.parent_id
                            )
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
