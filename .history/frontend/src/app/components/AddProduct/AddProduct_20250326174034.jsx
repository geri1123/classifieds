"use client"
import { useState } from "react";


import SelectCategory from "./Steps/SelectCategory";
export default function AddProduct(){
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
       category_id:'',
        subcategory_id:'',
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
    return(
        <div>
            <h1>Add Product</h1>
            <div className="w-full ">
                {step===1 && <SelectCategory changeHandler={changeHandler} formData={formData} setFormData={setFormData}/>}
                {step===1 && <button>Submit</button>}
            </div>
            
        </div>
    )
}