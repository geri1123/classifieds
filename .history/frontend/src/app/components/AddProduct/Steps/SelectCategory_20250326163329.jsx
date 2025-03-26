"use client";
import { useEffect, useState } from "react";

export default function SelectCategory({ formData, changeHandler }) {
    const [categories, setCategories] = useState([]);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`); // Adjust the URL if needed
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

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
                            onChange={changeHandler} // Use the passed function directly
                        />
                        {category.name}
                    </label>
                ))
            ) : (
                <p>Loading categories...</p>
            )}
        </div>
    );
}
