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

    // Fetch direct subcategories for a selected category
    async function fetchSubcategories(categoryId) {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/subcategories`, {
                params: { categoryId },
            });

            // Filter to show only subcategories with no parent (direct subcategories)
            const directSubcategories = response.data.filter(subcategory => subcategory.parent_id === null);
            setSubcategories(directSubcategories);
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
        fetchSubcategories(categoryId); // Fetch subcategories when a category is selected
    }

    // Render direct subcategories for the selected category
    function renderSubcategories() {
        return subcategories.map(subcategory => (
            <div key={subcategory.id} style={{ marginLeft: '20px' }}>
                <p className="text-lg">{subcategory.name}</p>
            </div>
        ));
    }

    return (
        <div className="select-category">
            <div className="categories">
                {categories.map(category => (
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
                        <div>{renderSubcategories()}</div>
                    ) : (
                        <p>No subcategories available for this category.</p>
                    )}
                </div>
            )}
        </div>
    );
}
