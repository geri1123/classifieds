"use client";
import { useEffect, useState } from "react";

export default function SelectCategory({ formData, changeHandler }) {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    // Fetch subcategories when a category is selected
    useEffect(() => {
        if (!selectedCategory) return;

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
    }, [selectedCategory]);

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
                            checked={formData.category_id.includes(category.id)}
                            onChange={(e) => {
                                changeHandler(e); // Update formData
                                setSelectedCategory(e.target.value); // Store selected category
                            }}
                        />
                        {category.name}
                    </label>
                ))
            ) : (
                <p>Loading categories...</p>
            )}

            {/* Show subcategories when a category is selected */}
            {selectedCategory && (
                <div>
                    <h3>Parent Subcategories</h3>
                    <select name="subcategory_id" onChange={changeHandler}>
                        <option value="">Select a subcategory</option>
                        {subcategories
                            .filter((sub) => String(sub.category_id) === String(selectedCategory) && !sub.parent_id)
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
