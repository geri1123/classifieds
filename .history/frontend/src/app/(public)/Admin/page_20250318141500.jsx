"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageAttributes() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Function to fetch categories
    async function fetchCategories() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    async function addCategory() {
        if (!newCategory.trim()) {
            setErrorMessage("Category name is required!");
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`, {
                name: newCategory,
            });

            const newCat = { id: response.data.categoryId, name: newCategory }; // New category
            setCategories([...categories, newCat]); // Update state with new category
            setNewCategory(""); // Clear input
            setErrorMessage(""); // Clear error message
        } catch (error) {
            if (error.response && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage("An error occurred while adding the category.");
            }
        }
    }

    useEffect(() => {
        fetchCategories(); // Fetch categories when component mounts
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Manage Categories</h1>

            <div className="grid grid-cols-2 gap-6">
                {/* Left: Add Category Form */}
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Add Category</h2>
                    <input
                        type="text"
                        className="border p-2 w-full rounded"
                        placeholder="Category Name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                    <button
                        onClick={addCategory}
                        className="bg-blue-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-blue-600"
                    >
                        Add Category
                    </button>
                </div>

                {/* Right: Display Categories */}
                <div className="bg-gray-100 p-4 rounded-lg shadow max-h-[1500px]">
                    <h2 className="text-lg font-semibold mb-2">All Categories</h2>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div key={category.id} className="flex gap-4 border-b py-2">
                                <p>ID: {category.id}</p>
                                <p>Category: {category.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No categories found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
