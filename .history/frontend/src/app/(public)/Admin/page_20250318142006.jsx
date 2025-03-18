"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageAttributes() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newSubcategory, setNewSubcategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [subcategories, setSubcategories] = useState([]);

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

    async function addCategory() {
        if (!newCategory.trim()) {
            setErrorMessage("Category name is required!");
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`, {
                name: newCategory,
            });

            const newCat = { id: response.data.categoryId, name: newCategory };
            setCategories([...categories, newCat]); // Update UI
            setNewCategory("");
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Error adding category.");
        }
    }

    async function addSubcategory() {
        if (!newSubcategory.trim() || !selectedCategory) {
            setErrorMessage("Both category and subcategory name are required!");
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategory`, {
                name: newSubcategory,
                category_id: selectedCategory,
            });

            const newSubcat = { id: response.data.subcategoryId, name: newSubcategory, category_id: selectedCategory };
            setSubcategories([...subcategories, newSubcat]); // Update UI
            setNewSubcategory("");
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Error adding subcategory.");
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Manage Categories & Subcategories</h1>

            <div className="grid grid-cols-2 gap-6">
                {/* Add Category Form */}
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

                {/* Add Subcategory Form */}
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Add Subcategory</h2>
                    <select
                        className="border p-2 w-full rounded"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        className="border p-2 w-full rounded mt-2"
                        placeholder="Subcategory Name"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                    />
                    <button
                        onClick={addSubcategory}
                        className="bg-green-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-green-600"
                    >
                        Add Subcategory
                    </button>
                </div>
            </div>

            {/* Display Categories & Subcategories */}
            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Categories & Subcategories</h2>
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <div key={category.id} className="mb-4">
                            <p className="font-bold">📂 {category.name}</p>
                            <ul className="ml-4 list-disc">
                                {subcategories
                                    .filter((sub) => sub.category_id === category.id)
                                    .map((sub) => (
                                        <li key={sub.id}>📁 {sub.name}</li>
                                    ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No categories found.</p>
                )}
            </div>
        </div>
    );
}
