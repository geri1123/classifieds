import { useEffect } from "react";

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
            <select name="category" id="category">
                <option value="all">All</option>
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelery</option>
                <option value="men's clothing">Men's clothing</option>
                <option value="women's clothing">Women's clothing</option>
            </select>
        </div>
    )
}