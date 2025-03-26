import { useEffect, useState } from "react";
import axios from "axios";
export default function SelectCategory(){
        const [categories, setCategories] = useState([]);
    
    async function fetchCategories() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, [])
    return(
        <div className="select-category">
            {categories.map((category) => (
                <div key={category.id} className="category">
                    
                    <p className="text-lg font-semibold">{category.name}</p>
                </div>
            ))}
        </div>
    )
}