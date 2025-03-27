"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SelectCategory from "@/components/AddProduct/Steps/SelectCategory";
import AddPProductFields from "@/components/AddProduct/Steps/AddProductfields";

export default function AddProduct() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        category_id: '',
        subcategory_id: '',
        subcategory_item_id: '',
        title: '',
    });
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [errorMessage, setErrorMessage] = useState(''); // Error state for category and subcategory
    const dispatch = useDispatch();
    const { categories, subcategories, subcategoriesItem, loading } = useSelector((state) => state.category);

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
                credentials: "include",
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

    const handleNextStep = () => {
        // Validate that category and subcategory are selected
        if (!formData.category_id || !formData.subcategory_id) {
            setErrorMessage("Please select a category and a subcategory.");
            return; // Prevent moving to next step
        }
        
        setErrorMessage(''); // Clear any previous error messages
        setIsLoading(true); // Start loading
        setTimeout(() => {
            setStep(2); // Go to step 2 after 2 seconds
            setIsLoading(false); // Stop loading
        }, 2000);
    };

    return (
        <div className="w-full p-8">
            <h1 className="text-black font-semibold text-xl">Add Product</h1>
            <div className="w-full">
                {step === 1 && <SelectCategory changeHandler={changeHandler} formData={formData} setFormData={setFormData} />}
                
                {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Show error message */}

                {step === 1 && (
                    <button 
                        onClick={handleNextStep} 
                        disabled={isLoading}  // Disable button while loading
                        className={`btn border-2 text-black border-yellow-40 text-black px-4 py-2 rounded-lg ${isLoading ? " cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm">Loading...</span> // Loading spinner
                        ) : (
                            "Next"
                        )}
                    </button>
                )}

                {step === 2 && (
                    <AddPProductFields
                        categories={categories} // Pass categories as props
                        subcategories={subcategories}
                        subcategoriesItem={subcategoriesItem}
                        changeHandler={changeHandler}
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}

                {step === 2 && <button onClick={handlesubmit}>Submit</button>}
            </div>
        </div>
    );
}
