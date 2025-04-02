// "use client";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import SelectCategory from "@/components/AddProduct/Steps/SelectCategory";
// import AddPProductFields from "@/components/AddProduct/Steps/AddProductfields";
// import { useUser } from "@/Context/UserContext";
// import Button from "@/components/ui/Button";

// export default function AddProduct() {
//     const [step, setStep] = useState(1);
//     const {user}=useUser();
//     const [formData, setFormData] = useState({
//         category_id: '',
//         subcategory_id: '',
//         subcategory_item_id: '',
//         title: '',
//         currency:'Euro',
//         price:'',
//         description:'',
//         product_img: [],
//         attributes: {}, 
//         country:'',
//         city:'',
//         address:'',
//         user_firstname:user?.first_name ||'',
//         user_lastname:user?.last_name ||'',
//         user_email:user?.email ||'',
//         user_phone:user?.phone || '',
//         status_type: 'published', 
//     });
    
//     // Separate loading states for different actions
//     const [isDraftLoading, setIsDraftLoading] = useState(false);
//     const [isSubmitLoading, setIsSubmitLoading] = useState(false);
//     const [isNextStepLoading, setIsNextStepLoading] = useState(false);
    
//     const [errorMessage, setErrorMessage] = useState(''); // Error state for category and subcategory
//     const [errors , setErrors]=useState('');
//     const dispatch = useDispatch();
//     const { categories, subcategories, subcategoriesItem, loading } = useSelector((state) => state.category);

    
//     const changeHandler = (e) => {
//         const { name, value, type, checked } = e.target;

//         setFormData((prevData) => {
//             const newFormData = {
//                 ...prevData,
//                 [name]: type === "checkbox"
//                     ? checked
//                         ? [...prevData[name], value] // Add if checked
//                         : prevData[name].filter((id) => id !== value) // Remove if unchecked
//                     : value, // Handle other input types
//             };

//             // If both category and subcategory are selected, clear the error message
//             if (newFormData.category_id && newFormData.subcategory_id) {
//                 setErrorMessage('');
//             }

//             return newFormData;
//         });
//     };
    
//     const handlesubmit = async (status) => {
//         // Set the appropriate loading state based on the action
//         if (status === 'draft') {
//             setIsDraftLoading(true);
//         } else {
//             setIsSubmitLoading(true);
//         }
    
//         try {
//             const formDataToSend = new FormData();
        
//             // Add status_type to the form data
//             formDataToSend.append('status_type', status);
            
//             // Add the rest of your form data
//             Object.keys(formData).forEach(key => {
//                 if (key === 'product_img') {
//                     formData.product_img.forEach(image => {
//                         formDataToSend.append('product_img', image);
//                     });
//                 } else if (key === 'attributes') {
//                     Object.entries(formData.attributes).forEach(([attributeId, value]) => {
//                         formDataToSend.append(`attributes[${attributeId}]`, value);
//                     });
//                 } else if (key !== 'status_type') { // Skip status_type as we're already setting it
//                     formDataToSend.append(key, formData[key]);
//                 }
//             });
    
//             const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/add-product`, {
//                 method: "POST",
//                 credentials: "include",
//                 body: formDataToSend,
//             });
    
//             const data = await response.json();
    
//             if (response.ok) {
//                 alert(`Product ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
//                 setErrors('');
//                 setStep(1);
//                 setFormData({
//                     category_id: '',
//                     subcategory_id: '',
//                     subcategory_item_id: '',
//                     title: '',
//                     currency: 'Euro',
//                     price: '',
//                     description: '',
//                     product_img: [],
//                     attributes: {}, 
//                     country:'',
//                     city:'',
//                     address:'',
//                     user_firstname:user?.first_name ||'',
//                     user_lastname:user?.last_name ||'',
//                     user_email:user?.email ||'',
//                     user_phone:user?.phone || '',
//                     status_type: 'published',
//                 });
//             } else {
//                 setErrors(data.errors || "Error submitting product.");
//             }
//         } catch (error) {
//             console.error("Error submitting product:", error);
//             alert("Failed to add product.");
//         } finally {
//             // Reset the appropriate loading state
//             if (status === 'draft') {
//                 setIsDraftLoading(false);
//             } else {
//                 setIsSubmitLoading(false);
//             }
//         }
//     };
    
//     const handleNextStep = () => {
//         // Validate that category and subcategory are selected
//         if (!formData.category_id || !formData.subcategory_id) {
//             setErrorMessage("Please select a category and a subcategory.");
//             return; 
//         }
        
//         setErrorMessage(''); // Clear any previous error messages
//         setIsNextStepLoading(true);
//         setTimeout(() => {
//             setStep(2); 
//             setIsNextStepLoading(false); 
//         }, 2000);
//     };

//     return (
//         <div className="w-full py-7 px-4 sm:px-10 lg:px-20 flex flex-col gap-3">
//             <h1 className="text-black font-semibold text-xl">Add Product</h1>
//             <div className="w-full">
//             {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Show error message */}
//                 {step === 1 && <SelectCategory  changeHandler={changeHandler} formData={formData} setFormData={setFormData} />}
                
             
//                 {step === 1 && (
//                     <button 
//                         onClick={handleNextStep} 
//                         disabled={isNextStepLoading}  // Disable button while loading
//                         className={`btn border-2 my-4 text-right text-black border-yellow-40 text-black px-4 py-2 rounded-lg ${isNextStepLoading ? " cursor-not-allowed" : ""}`}
//                     >
//                         {isNextStepLoading ? (
//                             <span className="spinner-border spinner-border-sm">Loading...</span> // Loading spinner
//                         ) : (
//                             "Next"
//                         )}
//                     </button>
//                 )}

//                 {step === 2 && (
//                     <AddPProductFields
//                         categories={categories} // Pass categories as props
//                         subcategories={subcategories}
//                         subcategoriesItem={subcategoriesItem}
//                         changeHandler={changeHandler}
//                         formData={formData}
//                         setFormData={setFormData}
//                         errors={errors}
                  
//                     />
//                 )}

//                 {step === 2 && 
//                 <div className="flex gap-4 w-full justify-around items-center">
//                     <button 
//                         onClick={() => setStep(1)}
//                         className="btn border-2 my-4 text-right text-black border-yellow-40 text-black px-4 py-2 rounded-lg"
//                     >
//                         Back
//                     </button> 
//                     <div className="w-auto flex gap-4">
//                         <Button 
//                             loading={isDraftLoading}
//                             disabled={isDraftLoading || isSubmitLoading}
//                             onClick={() => handlesubmit('draft')}
//                         >
//                             Draft
//                         </Button>

//                         <Button
//                             loading={isSubmitLoading}
//                             onClick={() => handlesubmit('published')}
//                             disabled={isDraftLoading || isSubmitLoading} 
//                         >
//                             Submit
//                         </Button>
//                     </div>
//                 </div>
//                 }
//             </div>
//         </div>
//     );
// }
 "use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SelectCategory from "@/components/AddProduct/Steps/SelectCategory";
import AddPProductFields from "@/components/AddProduct/Steps/AddProductfields";
import { useUser } from "@/Context/UserContext";
import Button from "@/components/ui/Button";

export default function AddProduct() {
    const [step, setStep] = useState(1);
    const {user}=useUser();
    const [formData, setFormData] = useState({
        category_id: '',
        subcategory_id: '',
        subcategory_item_id: '',
        title: '',
        currency:'Euro',
        price:'',
        description:'',
        product_img: [], // For images
        product_doc: [], // For PDF documents
        attributes: {}, 
        country:'',
        city:'',
        address:'',
        user_firstname:user?.first_name ||'',
        user_lastname:user?.last_name ||'',
        user_email:user?.email ||'',
        user_phone:user?.phone || '',
        status_type: 'published', 
    });
    
    // Separate loading states for different actions
    const [isDraftLoading, setIsDraftLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isNextStepLoading, setIsNextStepLoading] = useState(false);
    
    const [errorMessage, setErrorMessage] = useState(''); // Error state for category and subcategory
    const [errors , setErrors]=useState('');
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
    
    const handlesubmit = async (status) => {
       
        // Set the appropriate loading state based on the action
        if (status === 'draft') {
            setIsDraftLoading(true);
        } else {
            setIsSubmitLoading(true);
        }
    
        try {
            const formDataToSend = new FormData();
        
            // Add status_type to the form data
            formDataToSend.append('status_type', status);
            
            // Add the rest of your form data
            Object.keys(formData).forEach(key => {
                if (key === 'product_img') {
                    formData.product_img.forEach(image => {
                        formDataToSend.append('files', image); // All files go into a single 'files' field
                    });
                } else if (key === 'product_doc') {
                    formData.product_doc.forEach(doc => {
                        formDataToSend.append('files', doc); // All files go into a single 'files' field
                    });
                } else if (key === 'attributes') {
                    Object.entries(formData.attributes).forEach(([attributeId, value]) => {
                        formDataToSend.append(`attributes[${attributeId}]`, value);
                    });
                } else if (key !== 'status_type') { // Skip status_type as we're already setting it
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
                alert(`Product ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
                setErrors('');
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
                    product_doc: [],
                    attributes: {}, 
                    country:'',
                    city:'',
                    address:'',
                    user_firstname:user?.first_name ||'',
                    user_lastname:user?.last_name ||'',
                    user_email:user?.email ||'',
                    user_phone:user?.phone || '',
                    status_type: 'published',
                });
            } else {
                setErrors(data.errors || "Error submitting product.");
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }
        } catch (error) {
            console.error("Error submitting product:", error);
            
            alert("Failed to add product.");
        } finally {
            // Reset the appropriate loading state
            if (status === 'draft') {
                setIsDraftLoading(false);
            } else {
                setIsSubmitLoading(false);
            }
        }
    };
    
    const handleNextStep = () => {
        // Validate that category and subcategory are selected
        if (!formData.category_id || !formData.subcategory_id) {
            setErrorMessage("Please select a category and a subcategory.");
            return; 
        }
        
        setErrorMessage(''); // Clear any previous error messages
        setIsNextStepLoading(true);
        setTimeout(() => {
            setStep(2); 
            setIsNextStepLoading(false); 
        }, 2000);
    };

    return (
        <div className="w-full py-7 px-4 sm:px-10 lg:px-20 flex flex-col gap-3">
            <h1 className="text-black font-semibold text-xl">Add Product</h1>
            <div className="w-full">
            {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Show error message */}
                {step === 1 && <SelectCategory  changeHandler={changeHandler} formData={formData} setFormData={setFormData} />}
                
             
                {step === 1 && (
                    <button 
                        onClick={handleNextStep} 
                        disabled={isNextStepLoading}  // Disable button while loading
                        className={`btn border-2 my-4 text-right text-black border-yellow-40 text-black px-4 py-2 rounded-lg ${isNextStepLoading ? " cursor-not-allowed" : ""}`}
                    >
                        {isNextStepLoading ? (
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
                        errors={errors}
                  
                    />
                )}

                {step === 2 && 
                <div className="flex gap-4 w-full justify-around items-center">
                    <button 
                        onClick={() => setStep(1)}
                        className="btn border-2 my-4 text-right text-black border-yellow-40 text-black px-4 py-2 rounded-lg"
                    >
                        Back
                    </button> 
                    <div className="w-auto flex gap-4">
                        <Button 
                            loading={isDraftLoading}
                            disabled={isDraftLoading || isSubmitLoading}
                            onClick={() => handlesubmit('draft')}
                        >
                            Draft
                        </Button>

                        <Button
                            loading={isSubmitLoading}
                            onClick={() => handlesubmit('published')}
                            disabled={isDraftLoading || isSubmitLoading} 
                        >
                            Submit
                        </Button>
                    </div>
                </div>
                }
            </div>
        </div>
    );
}