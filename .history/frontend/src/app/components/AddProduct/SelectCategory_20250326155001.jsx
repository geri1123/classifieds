import { useEffect, useState } from "react";
import axios from "axios";

export default function SelectCategory() {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // Fetch categories
    async function fetchCategories() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    // Fetch subcategories for a category and handle hierarchical structure
    async function fetchSubcategories(categoryId) {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategories`, {
                params: { categoryId },
            });

            // Organize subcategories by their parent-child relationships
            const allSubcategories = response.data;
            const structuredSubcategories = buildSubcategoryTree(allSubcategories);
            setSubcategories(structuredSubcategories);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    }

    // Helper function to structure subcategories in a tree (parent-child relationships)
    function buildSubcategoryTree(subcategories) {
        const tree = [];
        const map = {};

        // Build a map of subcategories by their ID
        subcategories.forEach(subcategory => {
            subcategory.children = [];
            map[subcategory.id] = subcategory;
        });

        // Assign children to their respective parent
        subcategories.forEach(subcategory => {
            if (subcategory.parent_id) {
                map[subcategory.parent_id].children.push(subcategory);
            } else {
                tree.push(subcategory);
            }
        });

        return tree;
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle category selection
    function handleCategorySelect(event) {
        const categoryId = event.target.value;
        setSelectedCategoryId(categoryId);
        fetchSubcategories(categoryId); // Fetch subcategories when a category is selected
    }

    // Recursively render subcategories (parent-child)
    function renderSubcategories(subcategoryList) {
        return subcategoryList.map((subcategory) => (
            <div key={subcategory.id} style={{ marginLeft: '20px' }}>
                <p className="text-lg">{subcategory.name}</p>
                {subcategory.children && subcategory.children.length > 0 && (
                    <div style={{ marginLeft: '20px' }}>
                        {renderSubcategories(subcategory.children)} {/* Recursive call */}
                    </div>
                )}
            </div>
        ));
    }

    return (
        <div className="select-category">
            <div className="categories">
                {categories.map((category) => (
                    <div key={category.id} className="category">
                        <input
                            type="checkbox"
                            value={category.id}
                            onChange={handleCategorySelect}
                            checked={selectedCategoryId === category.id}
                        />
                        <p className="text-lg font-semibold text-black">{category.name}</p>
                    </div>
                ))}
            </div>

            {selectedCategoryId && (
                <div className="subcategories">
                    <h2>Subcategories:</h2>
                    {subcategories.length > 0 ? (
                        <div>{renderSubcategories(subcategories)}</div>
                    ) : (
                        <p>No subcategories available for this category.</p>
                    )}
                </div>
            )}
        </div>
    );
}
