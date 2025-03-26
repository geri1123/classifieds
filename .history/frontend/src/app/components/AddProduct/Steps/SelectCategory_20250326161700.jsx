"use client";
import { useState, useEffect } from "react";
import SelectCategory from "./Steps/SelectCategory";
import axios from "axios";

export default function SelectCategory() {
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);

    // Fetch categories
    async function fetchCategories() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    // Fetch all subcategories (including parent subcategories) for a selected category
    async function fetchAllSubcategories(categoryId) {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategories`, {
                params: { categoryId },
            });

            // Fetch subcategories with their parent subcategories
            setSubcategories(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle category selection
    function handleCategorySelect(event) {
        const categoryId = event.target.value;
        setSelectedCategoryId(categoryId);
        fetchAllSubcategories(categoryId); // Fetch all subcategories when a category is selected
    }

    // Recursive function to render parent subcategory
    function renderParentSubcategory(parentId) {
        const parentSubcategory = subcategories.find(sub => sub.id === parentId);
        if (parentSubcategory) {
            return (
                <div key={parentSubcategory.id} style={{ marginLeft: '20px' }}>
                    <p className="text-lg">{parentSubcategory.name}</p>
                    {parentSubcategory.parent_id && renderParentSubcategory(parentSubcategory.parent_id)}
                </div>
            );
        }
        return null;
    }

    // Render subcategories and their parent subcategories
    function renderSubcategories() {
        return subcategories.map(subcategory => (
            <div key={subcategory.id} style={{ marginLeft: '20px' }}>
                <p className="text-lg">{subcategory.name}</p>
                {subcategory.parent_id && renderParentSubcategory(subcategory.parent_id)}
            </div>
        ));
    }

    return (
        <div>
            <h1>Add Product</h1>
            <div>
                {step === 1 && (
                    <div>
                        <h2>Select Category</h2>
                        <select
                            value={selectedCategoryId}
                            onChange={handleCategorySelect}
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {selectedCategoryId && (
                            <div>
                                <h2>Subcategories:</h2>
                                {subcategories.length > 0 ? (
                                    <div>{renderSubcategories()}</div>
                                ) : (
                                    <p>No subcategories available for this category.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {step === 1 && <button>Submit</button>}
            </div>
        </div>
    );
}