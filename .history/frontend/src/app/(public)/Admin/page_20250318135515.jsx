"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageAttributes() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    async function addCategory() {
        if (!newCategory.trim()) {
            setErrorMessage("Category name is required!");
            return;
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`, { name: newCategory });
            setNewCategory('');
            setErrorMessage(''); // Clear error message on successful addition
        } catch (error) {
            if (error.response && error.response.data.error) {
                setErrorMessage(error.response.data.error); // Set error message from backend
            } else {
                setErrorMessage("An error occurred while adding the category.");
            }
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
                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                    )}
                    <button 
                        onClick={addCategory} 
                        className="bg-blue-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-blue-600"
                    >
                        Add Category
                    </button>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                        <p>ID :</p>
                        <p>Name :</p>
                </div>
            </div>
        </div>
    );
}
