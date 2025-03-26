"use client"
import { useState } from "react";


import SelectCategory from "./Steps/SelectCategory";
export default function AddProduct(){
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
       category_id:'',
        subcategory_id:'',
        subcategory_item_id:'',
        title:'',
    });
    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;
    
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox"
                ? checked
                    ? [...prevData[name], value] // Add if checked
                    : prevData[name].filter((id) => id !== value) // Remove if unchecked
                : value, // Handle other input types
        }));
    };

    const handlesubmit = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/add-product`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Product added successfully!");
                setFormData({ category_id: "", subcategory_id: "", subcategory_item_id: "", title: "" }); // Reset form
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error submitting product:", error);
            alert("Failed to add product.");
        }
    };
    return(
        <div className="w-full p-8"> 
            <h1 className="text-black font-semibold text-xl">Add Product</h1>
            <div className="w-full ">
                {step===1 && <SelectCategory  changeHandler={changeHandler} formData={formData} setFormData={setFormData}/>}
                {step===1 && <button onClick={handlesubmit}>Submit</button>}
            </div>
            
        </div>
    )
}