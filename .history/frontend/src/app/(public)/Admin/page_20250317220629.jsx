
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageAttributes() {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState('');
    const [newAttribute, setNewAttribute] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
        setCategories(res.data);
    }

    async function fetchSubcategories(categoryId) {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories/${categoryId}/subcategories`);
        setSubcategories(res.data);
    }

    async function fetchAttributes(subcategoryId) {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/attributes/${subcategoryId}`);
        setAttributes(res.data);
    }

    async function addCategory() {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`, { name: newCategory });
        setNewCategory('');
        fetchCategories();
    }

    async function addSubcategory() {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategory`, { name: newSubcategory, category_id: selectedCategory });
        setNewSubcategory('');
        fetchSubcategories(selectedCategory);
    }

    async function addAttribute() {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/attribute`, { name: newAttribute, subcategory_id: selectedSubcategory });
        setNewAttribute('');
        fetchAttributes(selectedSubcategory);
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Manage Categories, Subcategories & Attributes</h1>
            
            {/* Add Category */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Add Category</h2>
                <input 
                    type="text" 
                    className="border p-2 w-full" 
                    placeholder="Category Name" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={addCategory} className="bg-blue-500 text-white px-4 py-2 mt-2">Add Category</button>
            </div>

            {/* Add Subcategory */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Add Subcategory</h2>
                <select className="border p-2 w-full" onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <input 
                    type="text" 
                    className="border p-2 w-full mt-2" 
                    placeholder="Subcategory Name" 
                    value={newSubcategory} 
                    onChange={(e) => setNewSubcategory(e.target.value)}
                />
                <button onClick={addSubcategory} className="bg-blue-500 text-white px-4 py-2 mt-2">Add Subcategory</button>
            </div>

            {/* Add Attribute */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Add Attribute</h2>
                <select className="border p-2 w-full" onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    fetchAttributes(e.target.value);
                }}>
                    <option value="">Select Subcategory</option>
                    {subcategories &&subcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
                <input 
                    type="text" 
                    className="border p-2 w-full mt-2" 
                    placeholder="Attribute Name" 
                    value={newAttribute} 
                    onChange={(e) => setNewAttribute(e.target.value)}
                />
                <button onClick={addAttribute} className="bg-blue-500 text-white px-4 py-2 mt-2">Add Attribute</button>
            </div>

            {/* Display Attributes */}
            <div>
                <h2 className="text-lg font-semibold">Attributes</h2>
                <ul className="list-disc pl-4">
                    {attributes &&attributes.map(attr => (
                        <li key={attr.id}>{attr.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
