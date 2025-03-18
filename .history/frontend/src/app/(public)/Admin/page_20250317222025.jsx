'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageAttributes() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    // async function fetchCategories() {
    //     try {
    //         const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
    //         setCategories(res.data);
    //     } catch (error) {
    //         console.error("Error fetching categories:", error);
    //     }
    // }

    async function addCategory() {
        if (!newCategory.trim()) return alert("Category name is required!");

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`, { name: newCategory });
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            console.error("Error adding category:", error);
        }
    }

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
                    <button 
                        onClick={addCategory} 
                        className="bg-blue-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-blue-600"
                    >
                        Add Category
                    </button>
                </div>

                {/* Right: Display Categories */}
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">All Categories</h2>
                    {categories.length === 0 ? (
                        <p className="text-gray-500">No categories available.</p>
                    ) : (
                        <ul className="list-disc pl-4">
                            {categories.map((cat) => (
                                <li key={cat.id} className="text-gray-700">{cat.name}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
