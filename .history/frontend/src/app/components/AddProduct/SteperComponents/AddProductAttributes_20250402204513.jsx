// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAttributes } from "@redux/categorySlice";
// import InputField from "@/components/ui/InputField";
// import SelectInput from "@/components/ui/SelectInput"; 

// export default function AddProductAttributes({ formData, setFormData }) {
//     const dispatch = useDispatch();
//     const { attributes } = useSelector((state) => state.category);

//     // Fetch attributes whenever the subcategory changes
//     useEffect(() => {
//         if (formData.subcategory_id) {
//             dispatch(fetchAttributes(formData.subcategory_id));
//         }
//     }, [dispatch, formData.subcategory_id]);

//     // Handle input change for attributes
//     const handleAttributeChange = (e, attributeId) => {
//         const { value } = e.target;

//         // Update formData with the new attribute value
//         setFormData((prevData) => ({
//             ...prevData,
//             attributes: {
//                 ...prevData.attributes,
//                 [attributeId]: value, // Store the attribute value by its ID
//             },
//         }));
//     };

//     const renderInputField = (attribute) => {
//         if (attribute.name.toLowerCase() === "condition") {
//             // If attribute is condition, show dropdown
//             return (
//                 <SelectInput
//                     label={attribute.name}
//                     value={formData.attributes[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     name={attribute.id}
//                     options={[
//                         { id: 1, name: "new", symbol: "New" },
//                         { id: 2, name: "used", symbol: "Used" },
//                     ]}
//                     placeholder="Select Condition"
//                 />
//             );
//         }
//         if (attribute.name.toLowerCase() === "for") {
//             return (
//                 <SelectInput
//                     label={attribute.name}
//                     value={formData.attributes[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     name={attribute.id}
//                     options={[
//                         { id: 1, name: "rent", symbol: "Rent" },
//                         { id: 2, name: "sale", symbol: "Sale" },
//                     ]}
//                     placeholder="Sale or Rent"
//                 />
//             );
//         }
//         if (
//             [
//                 "build year",
//                 "bedrooms", 
//                 "bathrooms",
//                 "number of floors",
//                 "built year",
//             ].includes(attribute.name.toLowerCase())
//         ) {
//             return (
//                 <InputField
//                     label={attribute.name}
//                     value={formData.attributes[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     id={attribute.id}
//                     name={attribute.id}
//                     type="number"
//                     placeholder={`Enter ${attribute.name}`}
//                 />
//             );
//         }
//         if (attribute.name.toLowerCase() === "square feet") {
//             return (
//                 <InputField
//                     label={attribute.name}
//                     value={formData.attributes[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     id={attribute.id}
//                     name={attribute.id}
//                     type="number"
//                     placeholder="Enter Square Feet (m²)"
//                 />
//             );
//         }
    
//         if (attribute.name.toLowerCase() === "fuel") {
//             // If attribute is fuel, show dropdown with fuel types
//             return (
//                 <SelectInput
//                     label={attribute.name}
//                     value={formData.attributes[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     name={attribute.id}
//                     options={[
//                         { id: 1, name: "diesel", symbol: "Diesel" },
//                         { id: 2, name: "gas", symbol: "Gas" },
//                         { id: 3, name: "petrol", symbol: "Petrol" },
//                     ]}
//                     placeholder="Select Fuel Type"
//                 />
//             );
//         }

//         if (attribute.name.toLowerCase() === "transmission") {
//             // If attribute is transmission, show dropdown with options
//             return (
//                 <SelectInput
//                     label={attribute.name}
//                     value={formData.attributes[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     name={attribute.id}
//                     options={[
//                         { id: 1, name: "automatic", symbol: "Automatic" },
//                         { id: 2, name: "manual", symbol: "Manual" },
//                         { id: 3, name: "other", symbol: "Other" },
//                     ]}
//                     placeholder="Select Transmission Type"
//                 />
//             );
//         }

//         if (attribute.name.toLowerCase() === "kilometers") {
//             // If attribute is kilometers, show number input
//             return (
//                 <InputField
//                     label={attribute.name}
//                     value={formData.attributes[attribute.id] || ""}
//                     onChange={(e) => handleAttributeChange(e, attribute.id)}
//                     id={attribute.id}
//                     name={attribute.id}
//                     type="number"
//                     placeholder={`Enter ${attribute.name}`}
//                 />
//             );
//         }

//         // Default case, show text input for other attributes
//         return (
//             <InputField
//                 label={attribute.name}
//                 value={formData.attributes[attribute.id] || ""}
//                 onChange={(e) => handleAttributeChange(e, attribute.id)}
//                 id={attribute.id}
//                 name={attribute.id}
//                 type="text"
//                 placeholder={`Enter ${attribute.name}`}
//             />
//         );
//     };
//     if (!attributes || attributes.length === 0) {
//         return (
//             <div className="bg-gray-100 w-full flex flex-col gap-3 p-4 rounded-xl">
//                 <h2 className="text-lg font-semibold">No product specification for this subcategory</h2>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gray-100 w-full flex flex-col gap-3 p-4 rounded-xl">
//             <h2 className="text-md font-semibold">Product Specifications</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//                 {attributes.map((attribute) => (
//                     <div key={attribute.id}>
//                         {renderInputField(attribute)}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributes, fetchAttributeValues } from "@redux/categorySlice";
import InputField from "@/components/ui/InputField";
import SelectInput from "@/components/ui/SelectInput";

export default function AddProductAttributes({ formData, setFormData }) {
    const dispatch = useDispatch();
    const { attributes, attributeValues } = useSelector((state) => state.category);

    // Fetch attributes whenever the subcategory changes
    useEffect(() => {
        if (formData.subcategory_id) {
            dispatch(fetchAttributes(formData.subcategory_id));
        }
    }, [dispatch, formData.subcategory_id]);

    // Fetch attribute values for option-type attributes
    useEffect(() => {
        if (attributes && attributes.length > 0) {
            // Find attributes with type 'option' and fetch their values
            attributes.forEach(attribute => {
                if (attribute.type === 'option') {
                    dispatch(fetchAttributeValues(attribute.id));
                }
            });
        }
    }, [attributes, dispatch]);

    // Handle input change for attributes
    const handleAttributeChange = (e, attributeId) => {
        const { value } = e.target;

        // Update formData with the new attribute value
        setFormData((prevData) => ({
            ...prevData,
            attributes: {
                ...prevData.attributes,
                [attributeId]: value, // Store the attribute value by its ID
            },
        }));
    };

    const renderInputField = (attribute) => {
        // If this is an option-type attribute, show dropdown with fetched values
        if (attribute.type === 'option') {
            // Filter attributeValues for this specific attribute
            const options = attributeValues.filter(value => value.attribute_id === attribute.id);
            
            // Log the attribute and available values for debugging
            console.log(`Attribute: ${attribute.name} (${attribute.id})`, options);
            
            return (
                <div>
                    <SelectInput
                        label={`${attribute.name} (DB Field: ${attribute.db_name || attribute.name})`}
                        value={formData.attributes[attribute.id] || ""}
                        onChange={(e) => handleAttributeChange(e, attribute.id)}
                        name={attribute.id}
                        options={options.map(option => ({
                            id: option.id,
                            name: option.value,
                            symbol: option.value,
                            // Include the database field name if available
                            dbName: option.db_name || option.value
                        }))}
                        placeholder={`Select ${attribute.name}`}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        Available values: {options.map(opt => `${opt.value} (${opt.db_name || 'N/A'})`).join(', ')}
                    </div>
                </div>
            );
        }
        
        // Default case shows the attribute's database field name
        return (
            <div>
                <InputField
                    label={`${attribute.name} (DB Field: ${attribute.db_name || attribute.name})`}
                    value={formData.attributes[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    id={attribute.id}
                    name={attribute.id}
                    type="text"
                    placeholder={`Enter ${attribute.name}`}
                />
                <div className="text-xs text-gray-500 mt-1">
                    Database field: {attribute.db_name || attribute.name}
                </div>
            </div>
        );
    };

    if (!attributes || attributes.length === 0) {
        return (
            <div className="bg-gray-100 w-full flex flex-col gap-3 p-4 rounded-xl">
                <h2 className="text-lg font-semibold">No product specification for this subcategory</h2>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 w-full flex flex-col gap-3 p-4 rounded-xl">
            <h2 className="text-md font-semibold">Product Specifications</h2>
            {/* Debug information for all attributes */}
            <div className="mb-4 p-2 bg-gray-200 rounded text-xs">
                <h3 className="font-bold">Available Attributes:</h3>
                <pre>{JSON.stringify(attributes.map(a => ({id: a.id, name: a.name, db_name: a.db_name, type: a.type})), null, 2)}</pre>
                
                <h3 className="font-bold mt-2">Available Attribute Values:</h3>
                <pre>{JSON.stringify(attributeValues.map(v => ({id: v.id, attr_id: v.attribute_id, value: v.value, db_name: v.db_name})), null, 2)}</pre>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {attributes.map((attribute) => (
                    <div key={attribute.id} className="border border-gray-200 p-3 rounded">
                        {renderInputField(attribute)}
                    </div>
                ))}
            </div>
        </div>
    );
}