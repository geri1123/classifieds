

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAttributes, fetchAttributeValues, clearAttributeValues } from "@redux/categorySlice";
// import InputField from "@/components/ui/InputField";
// import SelectInput from "@/components/ui/SelectInput";

// export default function AddProductAttributes({ formData, setFormData }) {
//     const dispatch = useDispatch();
//     const { attributes, attributeValues, attributeValuesLoading } = useSelector((state) => state.category);

//     // Fetch attributes whenever the subcategory changes
//     useEffect(() => {
//         if (formData.subcategory_id) {
//             dispatch(fetchAttributes(formData.subcategory_id));
//             dispatch(clearAttributeValues()); // Clear previous attribute values
//         }
//     }, [dispatch, formData.subcategory_id]);

//     // Fetch attribute values for each attribute if type is 'option'
//     useEffect(() => {
//         attributes.forEach((attribute) => {
//             if (attribute.type === "option" && !attributeValues[attribute.id]) {
//                 dispatch(fetchAttributeValues(attribute.id));
//             }
//         });
//     }, [attributes, dispatch, attributeValues]);

//     // Initialize formData.attributes if not already initialized
//     useEffect(() => {
//         if (!formData.attributes) {
//             setFormData(prev => ({
//                 ...prev,
//                 attributes: {}
//             }));
//         }
//     }, [formData, setFormData]);

//     // Handle input change for attributes
//     const handleAttributeChange = (e, attributeId) => {
//         const { value } = e.target;

//         // Update formData with the new attribute value
//         setFormData((prevData) => ({
//             ...prevData,
//             attributes: {
//                 ...prevData.attributes,
//                 [attributeId]: value,
//             },
//         }));
//     };

//     const renderInputField = (attribute) => {
//         if (attribute.type.toLowerCase() === "option") {
//             // Get options for this specific attribute
//             const options = attributeValues[attribute.id] 
//                 ? attributeValues[attribute.id].map((option) => ({ id: option.id, name: option.name }))
//                 : [];

//             const isLoading = attributeValuesLoading[attribute.id];

//             return (
//                 <SelectInput
//                     key={attribute.id}
//                     label={attribute.name}
//                     name={`attribute-${attribute.id}`}
//                     value={formData.attributes?.[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     options={options}
//                     placeholder={isLoading ? "Loading options..." : `Select ${attribute.name}`}
//                     disabled={isLoading}
//                 />
//             );
//         } else {
//             // For other attribute types (e.g., text, number)
//             return (
//                 <InputField
//                     key={attribute.id}
//                     label={attribute.name}
//                     type={attribute.type === "number" ? "number" : "text"}
//                     name={`attribute-${attribute.id}`}
//                     value={formData.attributes?.[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     placeholder={`Enter ${attribute.name}`}
//                 />
//             );
//         }
//     };

//     return (
//         <div>
//             {attributes.length > 0 ? (
//                 attributes.map((attribute) => renderInputField(attribute))
//             ) : (
//                 <p>No attributes found for this subcategory</p>
//             )}
//         </div>
//     );
// }


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributes, fetchAttributeValues, clearAttributeValues } from "@redux/categorySlice";
import InputField from "@/components/ui/InputField";
import SelectInput from "@/components/ui/SelectInput";

export default function AddProductAttributes({ formData, setFormData }) {
    const dispatch = useDispatch();
    const { attributes, attributeValues, attributeValuesLoading } = useSelector((state) => state.category);

    // Fetch attributes whenever the subcategory changes
    useEffect(() => {
        if (formData.subcategory_id) {
            dispatch(fetchAttributes(formData.subcategory_id));
            dispatch(clearAttributeValues()); // Clear previous attribute values
        }
    }, [dispatch, formData.subcategory_id]);

    // Fetch attribute values for each attribute if type is 'option'
    useEffect(() => {
        attributes.forEach((attribute) => {
            if (attribute.type === "option" && !attributeValues[attribute.id]) {
                dispatch(fetchAttributeValues(attribute.id));
            }
        });
    }, [attributes, dispatch, attributeValues]);

    // Initialize formData.attributes if not already initialized
    useEffect(() => {
        if (!formData.attributes) {
            setFormData(prev => ({
                ...prev,
                attributes: {}
            }));
        }
    }, [formData, setFormData]);

    // Handle input change for attributes
    const handleAttributeChange = (e, attributeId) => {
        const { value, type, checked } = e.target;
        
        // For checkboxes, use the checked property instead of value
        const newValue = type === "checkbox" ? checked : value;

        // Update formData with the new attribute value
        setFormData((prevData) => ({
            ...prevData,
            attributes: {
                ...prevData.attributes,
                [attributeId]: newValue,
            },
        }));
    };

    // Handle checkbox change specifically
    const handleCheckboxChange = (e, attributeId) => {
        const { checked } = e.target;
        
        setFormData((prevData) => ({
            ...prevData,
            attributes: {
                ...prevData.attributes,
                [attributeId]: checked,
            },
        }));
    };

    const renderInputField = (attribute) => {
        if (attribute.type.toLowerCase() === "option") {
            // Get options for this specific attribute
            const options = attributeValues[attribute.id] 
                ? attributeValues[attribute.id].map((option) => ({ id: option.id, name: option.name }))
                : [];

            const isLoading = attributeValuesLoading[attribute.id];

            return (
                <SelectInput
                    key={attribute.id}
                    label={attribute.name}
                    name={`attribute-${attribute.id}`}
                    value={formData.attributes?.[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    options={options}
                    placeholder={isLoading ? "Loading options..." : `Select ${attribute.name}`}
                    disabled={isLoading}
                />
            );
        } else if (attribute.type.toLowerCase() === "checkbox") {
            // Render checkbox input
            return (
                <div key={attribute.id} className="flex items-center justify-end mb-4">
                    <input
                        type="checkbox"
                        id={`attribute-${attribute.id}`}
                        name={`attribute-${attribute.id}`}
                        checked={formData.attributes?.[attribute.id] || false}
                        onChange={(e) => handleCheckboxChange(e, attribute.id)}
                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label 
                        htmlFor={`attribute-${attribute.id}`}
                        className="text-sm font-medium text-gray-700"
                    >
                        {attribute.name}
                    </label>
                </div>
            );
        } else {
            // For other attribute types (e.g., text, number)
            return (
                <InputField
                    key={attribute.id}
                    label={attribute.name}
                    type={attribute.type === "number" ? "number" : "text"}
                    name={`attribute-${attribute.id}`}
                    value={formData.attributes?.[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    placeholder={`Enter ${attribute.name}`}
                />
            );
        }
    };

    // const renderAttributes = () => {
    //     const nonCheckboxAttributes = attributes.filter(attr => attr.type.toLowerCase() !== "checkbox");
    //     const checkboxAttributes = attributes.filter(attr => attr.type.toLowerCase() === "checkbox");

    //     return (
    //         <>
    //             {/* Render non-checkbox attributes */}
    //             <div className="mb-6">
    //                 {nonCheckboxAttributes.map(attribute => renderInputField(attribute))}
    //             </div>
                
    //             {/* Render checkbox attributes in a separate section aligned to the right */}
    //             {checkboxAttributes.length > 0 && (
    //                 <div className="border-t pt-4 mt-4">
    //                     <div className="text-right">
    //                         {checkboxAttributes.map(attribute => renderInputField(attribute))}
    //                     </div>
    //                 </div>
    //             )}
    //         </>
    //     );
    // };
    const renderAttributes = () => {
        const nonCheckboxAttributes = attributes.filter(attr => attr.type.toLowerCase() !== "checkbox");
        const checkboxAttributes = attributes.filter(attr => attr.type.toLowerCase() === "checkbox");
    
        return (
            <>
                {/* Render non-checkbox attributes in a two-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {nonCheckboxAttributes.map(attribute => renderInputField(attribute))}
                </div>
    
                {/* Render checkbox attributes in a separate grid */}
                {checkboxAttributes.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {checkboxAttributes.map(attribute => renderInputField(attribute))}
                        </div>
                    </div>
                )}
            </>
        );
    };
    
    return (
        <div>
            {attributes.length > 0 ? (
                renderAttributes()
            ) : (
                <p>No attributes found for this subcategory</p>
            )}
        </div>
    );
}