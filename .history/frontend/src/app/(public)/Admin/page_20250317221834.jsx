
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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`);
        setCategories(res.data);
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

          

            {/* Display Attributes */}
            <div>
              
            </div>
        </div>
    );
}
