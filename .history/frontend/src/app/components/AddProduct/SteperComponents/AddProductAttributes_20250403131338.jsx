

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
//         const { value, type, checked } = e.target;
        
//         // For checkboxes, use the checked property instead of value
//         const newValue = type === "checkbox" ? checked : value;

//         // Update formData with the new attribute value
//         setFormData((prevData) => ({
//             ...prevData,
//             attributes: {
//                 ...prevData.attributes,
//                 [attributeId]: newValue,
//             },
//         }));
//     };

//     // Handle checkbox change specifically
//     const handleCheckboxChange = (e, attributeId) => {
//         const { checked } = e.target;
        
//         setFormData((prevData) => ({
//             ...prevData,
//             attributes: {
//                 ...prevData.attributes,
//                 [attributeId]: checked,
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
//         } else if (attribute.type.toLowerCase() === "checkbox") {
//             // Render checkbox input
//             return (
//                 <div key={attribute.id} className="flex items-center justify-end mb-4">
//                     <input
//                         type="checkbox"
//                         id={`attribute-${attribute.id}`}
//                         name={`attribute-${attribute.id}`}
//                         checked={formData.attributes?.[attribute.id] || false}
//                         onChange={(e) => handleCheckboxChange(e, attribute.id)}
//                         className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label 
//                         htmlFor={`attribute-${attribute.id}`}
//                         className="text-sm font-medium text-gray-700"
//                     >
//                         {attribute.name}
//                     </label>
//                 </div>
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

//     const renderAttributes = () => {
//         const nonCheckboxAttributes = attributes.filter(attr => attr.type.toLowerCase() !== "checkbox");
//         const checkboxAttributes = attributes.filter(attr => attr.type.toLowerCase() === "checkbox");

//         return (
//             <>
//                 {/* Render non-checkbox attributes */}
//                 <div className="mb-6">
//                     {nonCheckboxAttributes.map(attribute => renderInputField(attribute))}
//                 </div>
                
//                 {/* Render checkbox attributes in a separate section aligned to the right */}
//                 {checkboxAttributes.length > 0 && (
//                     <div className="border-t  pt-4 mt-4">
//                         <div className="text-right">
//                             {checkboxAttributes.map(attribute => renderInputField(attribute))}
//                         </div>
//                     </div>
//                 )}
//             </>
//         );
//     };
   
//     return (
//         <div>
//             {attributes.length > 0 ? (
//                 renderAttributes()
//             ) : (
//                 <p>No attributes found for this subcategory</p>
//             )}
//         </div>
//     );
// }

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAttributes, fetchAttributeValues, clearAttributeValues } from "@redux/categorySlice";
// import InputField from "@/components/ui/InputField";
// import SelectInput from "@/components/ui/SelectInput";

// export default function AddProductAttributes({ formData, setFormData }) {
//     const dispatch = useDispatch();
//     const { attributes, attributeValues, attributeValuesLoading } = useSelector((state) => state.category);

//     useEffect(() => {
//         if (formData.subcategory_id) {
//             dispatch(fetchAttributes(formData.subcategory_id));
//             dispatch(clearAttributeValues());
//         }
//     }, [dispatch, formData.subcategory_id]);

//     useEffect(() => {
//         attributes.forEach((attribute) => {
//             if (attribute.type === "option" || attribute.type === "checkbox") {
//                 dispatch(fetchAttributeValues(attribute.id));
//             }
//         });
//     }, [attributes, dispatch]);

//     useEffect(() => {
//         if (!formData.attributes) {
//             setFormData(prev => ({
//                 ...prev,
//                 attributes: {}
//             }));
//         }
//     }, [formData, setFormData]);

//     const handleAttributeChange = (e, attributeId) => {
//         const { value } = e.target;

//         setFormData((prevData) => ({
//             ...prevData,
//             attributes: {
//                 ...prevData.attributes,
//                 [attributeId]: value,
//             },
//         }));
//     };

//     const handleCheckboxChange = (e, attributeId, attributeValueName) => {
//         const { checked } = e.target;

//         setFormData((prevData) => ({
//             ...prevData,
//             attributes: {
//                 ...prevData.attributes,
//                 [attributeId]: checked ? attributeValueName : "",
//             },
//         }));
//     };

//     const renderInputField = (attribute) => {
//         if (attribute.type.toLowerCase() === "option") {
//             const options = attributeValues[attribute.id] 
//                 ? attributeValues[attribute.id].map((option) => ({ id: option.id, name: option.name }))
//                 : [];

//             const isLoading = attributeValuesLoading[attribute.id];

//             return (
//                 <div className="max-w-40">
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
//                 </div>
//             );
//         } else if (attribute.type.toLowerCase() === "checkbox") {
//             const checkboxValues = attributeValues[attribute.id] || [];

//             return (
               
//                 <div key={attribute.id} className="mb-6 flex gap-6">
//                     <p className="text-sm font-medium text-gray-700">{attribute.name}</p>
//                     <div className="flex grid grid-cols-2 gap-2">
//                         {checkboxValues.map((value) => (
//                             <label key={value.id} className="flex items-center space-x-2">
//                                 <input
//                                     type="checkbox"
//                                     id={`attribute-${attribute.id}-${value.id}`}
//                                     name={`attribute-${attribute.id}`}
//                                     checked={formData.attributes?.[attribute.id] === value.name}
//                                     onChange={(e) => handleCheckboxChange(e, attribute.id, value.name)}
//                                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                 />
//                                 <span className="text-sm">{value.name}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
               
//             );
//         } else {
//             return (
//                 <div className="max-w-100">
//                 <InputField
//                     key={attribute.id}
//                     label={attribute.name}
//                     type={attribute.type === "number" ? "number" : "text"}
//                     name={`attribute-${attribute.id}`}
//                     value={formData.attributes?.[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     placeholder={`Enter ${attribute.name}`}
//                 />
//                 </div>
//             );
//         }
//     };

//     const renderAttributes = () => {
//         const nonCheckboxAttributes = attributes.filter(attr => attr.type.toLowerCase() !== "checkbox");
//         const checkboxAttributes = attributes.filter(attr => attr.type.toLowerCase() === "checkbox");

//         return (
//             <>
//                 <div className="mb-6 ">
//                     {nonCheckboxAttributes.map(attribute => renderInputField(attribute))}
//                 </div>
                
//                 {checkboxAttributes.length > 0 && (
//                     <div className="border-t pt-4 mt-4">
//                         <div className="text-left">
//                             {checkboxAttributes.map(attribute => renderInputField(attribute))}
//                         </div>
//                     </div>
//                 )}
//             </>
//         );
//     };
   
//     return (
//         <div>
//             {attributes.length > 0 ? (
//                 renderAttributes()
//             ) : (
//                 <p>No attributes found for this subcategory</p>
//             )}
//         </div>
//     );
// }



// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAttributes, fetchAttributeValues, clearAttributeValues } from "@redux/categorySlice";
// import InputField from "@/components/ui/InputField";
// import SelectInput from "@/components/ui/SelectInput";

// export default function AddProductAttributes({ formData, setFormData }) {
//     const dispatch = useDispatch();
//     const { attributes, attributeValues, attributeValuesLoading } = useSelector((state) => state.category);

//     useEffect(() => {
//         if (formData.subcategory_id) {
//             dispatch(fetchAttributes(formData.subcategory_id));
//             dispatch(clearAttributeValues());
//         }
//     }, [dispatch, formData.subcategory_id]);

//     useEffect(() => {
//         attributes.forEach((attribute) => {
//             if (attribute.type === "option" || attribute.type === "checkbox") {
//                 dispatch(fetchAttributeValues(attribute.id));
//             }
//         });
//     }, [attributes, dispatch]);

//     useEffect(() => {
//         if (!formData.attributes) {
//             setFormData(prev => ({
//                 ...prev,
//                 attributes: {}
//             }));
//         }
//     }, [formData, setFormData]);

//     const handleAttributeChange = (e, attributeId) => {
//         const { value } = e.target;

//         setFormData((prevData) => ({
//             ...prevData,
//             attributes: {
//                 ...prevData.attributes,
//                 [attributeId]: value,
//             },
//         }));
//     };

//     const handleCheckboxChange = (e, attributeId, attributeValueName) => {
//         const { checked } = e.target;
    
//         setFormData((prevData) => {
//             const prevSelected = prevData.attributes?.[attributeId] || []; // Get existing selected values (default to empty array)
//             let updatedValues = checked
//                 ? [...prevSelected, attributeValueName] // Add new value if checked
//                 : prevSelected.filter(value => value !== attributeValueName); // Remove value if unchecked
    
//             return {
//                 ...prevData,
//                 attributes: {
//                     ...prevData.attributes,
//                     [attributeId]: updatedValues,
//                 },
//             };
//         });
//     };

//     const renderInputField = (attribute) => {
//         if (attribute.type.toLowerCase() === "option") {
//             const options = attributeValues[attribute.id] 
//                 ? attributeValues[attribute.id].map((option) => ({ id: option.id, name: option.name }))
//                 : [];

//             const isLoading = attributeValuesLoading[attribute.id];

//             return (
//                 <div className="max-w-40">
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
//                 </div>
//             );
//         } else if (attribute.type.toLowerCase() === "checkbox") {
//             const checkboxValues = attributeValues[attribute.id] || [];

//             return (
               
//                 <div key={attribute.id} className="mb-6 flex gap-6">
//                     <p className="text-sm font-medium text-gray-700">{attribute.name}</p>
//                     <div className="flex grid grid-cols-2 gap-2">
//                         {checkboxValues.map((value) => (
//                             <label key={value.id} className="flex items-center space-x-2">
//                               <input
//     type="checkbox"
//     id={`attribute-${attribute.id}-${value.id}`}
//     name={`attribute-${attribute.id}`}
//     checked={(formData.attributes?.[attribute.id] || []).includes(value.name)}
//     onChange={(e) => handleCheckboxChange(e, attribute.id, value.name)}
//     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// />
//                                 <span className="text-sm">{value.name}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
               
//             );
//         } else {
//             return (
//                 <div className="max-w-100">
//                 <InputField
//                     key={attribute.id}
//                     label={attribute.name}
//                     type={attribute.type === "number" ? "number" : "text"}
//                     name={`attribute-${attribute.id}`}
//                     value={formData.attributes?.[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     placeholder={`Enter ${attribute.name}`}
//                 />
//                 </div>
//             );
//         }
//     };

//     const renderAttributes = () => {
//         const nonCheckboxAttributes = attributes.filter(attr => attr.type.toLowerCase() !== "checkbox");
//         const checkboxAttributes = attributes.filter(attr => attr.type.toLowerCase() === "checkbox");

//         return (
//             <>
//                 <div className="mb-6 ">
//                     {nonCheckboxAttributes.map(attribute => renderInputField(attribute))}
//                 </div>
                
//                 {checkboxAttributes.length > 0 && (
//                     <div className="border-t pt-4 mt-4">
//                         <div className="text-left">
//                             {checkboxAttributes.map(attribute => renderInputField(attribute))}
//                         </div>
//                     </div>
//                 )}
//             </>
//         );
//     };
   
//     return (
//         <div>
//             {attributes.length > 0 ? (
//                 renderAttributes()
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

    useEffect(() => {
        if (formData.subcategory_id) {
            dispatch(fetchAttributes(formData.subcategory_id));
            dispatch(clearAttributeValues());
        }
    }, [dispatch, formData.subcategory_id]);

    useEffect(() => {
        attributes.forEach((attribute) => {
            if (attribute.type === "option" || attribute.type === "checkbox") {
                dispatch(fetchAttributeValues(attribute.id));
            }
        });
    }, [attributes, dispatch]);

    useEffect(() => {
        if (!formData.attributes) {
            setFormData(prev => ({
                ...prev,
                attributes: {}
            }));
        }
    }, [formData, setFormData]);

    const handleAttributeChange = (e, attributeId) => {
        const { value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            attributes: {
                ...prevData.attributes,
                [attributeId]: value,
            },
        }));
    };

    const handleCheckboxChange = (e, attributeId, attributeValueId, attributeValueName) => {
        const { checked } = e.target;
    
        setFormData((prevData) => {
            // Get the current attributes object or initialize it
            const currentAttributes = prevData.attributes || {};
            
            // Create a new structure for checkboxes
            // Instead of storing an array of names, store an object with value IDs as keys
            const currentCheckboxValues = currentAttributes[attributeId] || {};
            
            const updatedCheckboxValues = {
                ...currentCheckboxValues
            };
            
            if (checked) {
                // Add the value ID with its name when checked
                updatedCheckboxValues[attributeValueId] = attributeValueName;
            } else {
                // Remove the value ID when unchecked
                const { [attributeValueId]: removedValue, ...remainingValues } = updatedCheckboxValues;
                return {
                    ...prevData,
                    attributes: {
                        ...prevData.attributes,
                        [attributeId]: remainingValues
                    }
                };
            }
            
            return {
                ...prevData,
                attributes: {
                    ...prevData.attributes,
                    [attributeId]: updatedCheckboxValues
                }
            };
        });
    };

    const renderInputField = (attribute) => {
        if (attribute.type.toLowerCase() === "option") {
            const options = attributeValues[attribute.id] 
                ? attributeValues[attribute.id].map((option) => ({ id: option.id, name: option.name }))
                : [];

            const isLoading = attributeValuesLoading[attribute.id];

            return (
                <div className="max-w-40">
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
                </div>
            );
        } else if (attribute.type.toLowerCase() === "checkbox") {
            const checkboxValues = attributeValues[attribute.id] || [];
            const selectedValues = formData.attributes?.[attribute.id] || {};

            return (
                <div key={attribute.id} className="mb-6 flex gap-6">
                    <p className="text-sm font-medium text-gray-700">{attribute.name}</p>
                    <div className="flex grid grid-cols-2 gap-2">
                        {checkboxValues.map((value) => (
                            <label key={value.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`attribute-${attribute.id}-${value.id}`}
                                    name={`attribute-${attribute.id}-${value.id}`}
                                    checked={!!selectedValues[value.id]}
                                    onChange={(e) => handleCheckboxChange(e, attribute.id, value.id, value.name)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm">{value.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="max-w-100">
                <InputField
                    key={attribute.id}
                    label={attribute.name}
                    type={attribute.type === "number" ? "number" : "text"}
                    name={`attribute-${attribute.id}`}
                    value={formData.attributes?.[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    placeholder={`Enter ${attribute.name}`}
                />
                </div>
            );
        }
    };

    const renderAttributes = () => {
        const nonCheckboxAttributes = attributes.filter(attr => attr.type.toLowerCase() !== "checkbox");
        const checkboxAttributes = attributes.filter(attr => attr.type.toLowerCase() === "checkbox");

        return (
            <>
                <div className="mb-6">
                    {nonCheckboxAttributes.map(attribute => renderInputField(attribute))}
                </div>
                
                {checkboxAttributes.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                        <div className="text-left">
                            {checkboxAttributes.map(attribute => renderInputField(attribute))}
                        </div>
                    </div>
                )}
            </>
        );
    };

    // For debugging - you can remove this in production
    const getFormDataForSubmission = () => {
        // Prepare data for backend by converting checkbox objects to format suitable for DB
        const preparedData = {...formData};
        
        if (preparedData.attributes) {
            const newAttributes = {};
            
            Object.entries(preparedData.attributes).forEach(([attributeId, value]) => {
                // Check if this is a checkbox attribute
                const isCheckbox = attributes.find(attr => 
                    attr.id.toString() === attributeId.toString() && 
                    attr.type.toLowerCase() === "checkbox"
                );
                
                if (isCheckbox && typeof value === 'object') {
                    // For checkbox attributes, create an array of key-value pairs
                    // Each key-value pair represents one attribute-value relation in the DB
                    newAttributes[attributeId] = Object.entries(value).map(([valueId, valueName]) => ({
                        attribute_id: attributeId,
                        attribute_value_id: valueId,
                        value: valueName
                    }));
                } else {
                    // For non-checkbox attributes, keep as is
                    newAttributes[attributeId] = value;
                }
            });
            
            preparedData.attributes = newAttributes;
        }
        
        return preparedData;
    };
   
    return (
        <div>
            {attributes.length > 0 ? (
                <>
                    {renderAttributes()}
                    
                    {/* Debug view - you can remove this in production */}
                    <div className="mt-6 p-4 bg-gray-100 rounded">
                        <h4 className="font-bold">Data Structure for Database:</h4>
                        <pre className="text-xs overflow-auto mt-2">
                            {JSON.stringify(getFormDataForSubmission(), null, 2)}
                        </pre>
                    </div>
                </>
            ) : (
                <p>No attributes found for this subcategory</p>
            )}
        </div>
    );
}