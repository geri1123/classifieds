"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SelectCategory from "@/components/AddProduct/Steps/SelectCategory";
import AddPProductFields from "@/components/AddProduct/Steps/AddProductfields";
import { useUser } from "@/Context/UserContext";

export default function AddProduct() {
    const [step, setStep] = useState(1);
    const {user}=useUser
    const [formData, setFormData] = useState({
        category_id: '',
        subcategory_id: '',
        subcategory_item_id: '',
        title: '',
        currency:'Euro',
        price:'',
        description:'',
        product_img: [],
        attributes: {}, 
        country:'',
        city:'',
        address:'',
        user_firstname:user?.first_name,
        user_lastname:user?.last_name,
        user_email:user?.email,
        user_phone:user?.phone_number,
    });
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [errorMessage, setErrorMessage] = useState(''); // Error state for category and subcategory
    const dispatch = useDispatch();
    const { categories, subcategories, subcategoriesItem, loading } = useSelector((state) => state.category);

    
    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevData) => {
            const newFormData = {
                ...prevData,
                [name]: type === "checkbox"
                    ? checked
                        ? [...prevData[name], value] // Add if checked
                        : prevData[name].filter((id) => id !== value) // Remove if unchecked
                    : value, // Handle other input types
            };

            // If both category and subcategory are selected, clear the error message
            if (newFormData.category_id && newFormData.subcategory_id) {
                setErrorMessage('');
            }

            return newFormData;
        });
    };
    const handlesubmit = async () => {
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'product_img') {
                    formData.product_img.forEach(image => {
                        formDataToSend.append('product_img', image);
                    });
                } else if (key === 'attributes') {
                    // Add attributes as separate key-value pairs
                    Object.entries(formData.attributes).forEach(([attributeId, value]) => {
                        formDataToSend.append(`attributes[${attributeId}]`, value);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/add-product`, {
                method: "POST",
                credentials: "include",
                body: formDataToSend,
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Product added successfully!");
                setStep(1);
                setFormData({
                    category_id: '',
                    subcategory_id: '',
                    subcategory_item_id: '',
                    title: '',
                    currency: 'Euro',
                    price: '',
                    description: '',
                    product_img: [],
                    attributes: {}, 
                    country:'',
                    city:'',
                    address:'',// Reset attributes
                });
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
            return; 
        }
        
        setErrorMessage(''); // Clear any previous error messages
        setIsLoading(true);
        setTimeout(() => {
            setStep(2); 
            setIsLoading(false); 
        }, 2000);
    };

    return (
        <div className="w-full py-7 px-4 sm:px-10 lg:px-20 flex flex-col gap-3">
            <h1 className="text-black font-semibold text-xl">Add Product</h1>
            <div className="w-full">
            {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Show error message */}
                {step === 1 && <SelectCategory changeHandler={changeHandler} formData={formData} setFormData={setFormData} />}
                
             

                {step === 1 && (
                    <button 
                        onClick={handleNextStep} 
                        disabled={isLoading}  // Disable button while loading
                        className={`btn border-2 my-4 text-right text-black border-yellow-40 text-black px-4 py-2 rounded-lg ${isLoading ? " cursor-not-allowed" : ""}`}
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
  // const handlesubmit = async () => {
    //     try {
    //         const formDataToSend = new FormData();
    //         Object.keys(formData).forEach(key => {
    //             if (key === 'product_img') {
    //                 formData.product_img.forEach(image => {
    //                     formDataToSend.append('product_img', image);
    //                 });
    //             } else {
    //                 formDataToSend.append(key, formData[key]);
    //             }
    //         });
        
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/add-product`, {
    //             method: "POST",
    //             credentials: "include",
    //             body: formDataToSend,
    //         });
        
    //         const data = await response.json();
        
    //         if (response.ok) {
    //             alert("Product added successfully!");
    //             // Reset form data
    //             setStep(1);
    //             setFormData({
    //                 category_id: '',
    //                 subcategory_id: '',
    //                 subcategory_item_id: '',
    //                 title: '',
    //                 currency: 'Euro',
    //                 price: '',
    //                 description: '',
    //                 product_img: [],
    //             });
    //         } else {
    //             alert(`Error: ${data.error}`);
    //         }
    //     } catch (error) {
    //         console.error("Error submitting product:", error);
    //         alert("Failed to add product.");
    //     }
    // };
