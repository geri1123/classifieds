"use client"
import { useState } from "react";

import Select from "./Steps/SelectCategory";
export default function AddProduct(){
    const [step, setStep] = useState(1);
    return(
        <div>
            <h1>Add Product</h1>
            <div>
                {step===1 && <Select/>}
                {step===1 && <button>Submit</button>}
            </div>
            
        </div>
    )
}