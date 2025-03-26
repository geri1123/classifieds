"use client"
import { useState } from "react";


import SelectCategory from "./Steps/SelectCategory";
export default function AddProduct(){
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
       category_id:'',

    });
    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;
    
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value, // Handle checkboxes and other inputs
        }));
    };
    return(
        <div>
            <h1>Add Product</h1>
            <div>
                {step===1 && <SelectCategory changeHandler={changeHandler}/>}
                {step===1 && <button>Submit</button>}
            </div>
            
        </div>
    )
}