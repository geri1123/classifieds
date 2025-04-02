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
import { fetchAttributes } from "@redux/categorySlice";
import InputField from "@/components/ui/InputField";
import SelectInput from "@/components/ui/SelectInput"; 

export default function AddProductAttributes({ formData, setFormData }) {
    const dispatch = useDispatch();
    const { attributes , attributeValues } = useSelector((state) => state.category);

    // Fetch attributes whenever the subcategory changes
    useEffect(() => {
        if (formData.subcategory_id) {
            dispatch(fetchAttributes(formData.subcategory_id));
        }
    }, [dispatch, formData.subcategory_id]);

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
        if (attribute.type.toLowerCase() === "option") {
            // If attribute is condition, show dropdown
            return (
                <SelectInput
                    label={attribute.name}
                    value={formData.attributes[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    name={attribute.id}
                    options={attributeValues.map((value)=>{[
                        { id: 1, name: "diesel", symbol: "Diesel" },
                        { id: 2, name: "gas", symbol: "Gas" },
                        { id: 3, name: "petrol", symbol: "Petrol" },
                    ]})}
                    placeholder="Select Condition"
                />
            );
        }
        if (attribute.name.toLowerCase() === "for") {
            return (
                <SelectInput
                    label={attribute.name}
                    value={formData.attributes[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    name={attribute.id}
                    options={[
                        { id: 1, name: "rent", symbol: "Rent" },
                        { id: 2, name: "sale", symbol: "Sale" },
                    ]}
                    placeholder="Sale or Rent"
                />
            );
        }
        if (
            [
                "build year",
                "bedrooms", 
                "bathrooms",
                "number of floors",
                "built year",
            ].includes(attribute.name.toLowerCase())
        ) {
            return (
                <InputField
                    label={attribute.name}
                    value={formData.attributes[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    id={attribute.id}
                    name={attribute.id}
                    type="number"
                    placeholder={`Enter ${attribute.name}`}
                />
            );
        }
        if (attribute.name.toLowerCase() === "square feet") {
            return (
                <InputField
                    label={attribute.name}
                    value={formData.attributes[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    id={attribute.id}
                    name={attribute.id}
                    type="number"
                    placeholder="Enter Square Feet (m²)"
                />
            );
        }
    
        if (attribute.name.toLowerCase() === "fuel") {
            // If attribute is fuel, show dropdown with fuel types
            return (
                <SelectInput
                    label={attribute.name}
                    value={formData.attributes[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    name={attribute.id}
                    options={[
                        { id: 1, name: "diesel", symbol: "Diesel" },
                        { id: 2, name: "gas", symbol: "Gas" },
                        { id: 3, name: "petrol", symbol: "Petrol" },
                    ]}
                    placeholder="Select Fuel Type"
                />
            );
        }

        if (attribute.name.toLowerCase() === "transmission") {
            // If attribute is transmission, show dropdown with options
            return (
                <SelectInput
                    label={attribute.name}
                    value={formData.attributes[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    name={attribute.id}
                    options={[
                        { id: 1, name: "automatic", symbol: "Automatic" },
                        { id: 2, name: "manual", symbol: "Manual" },
                        { id: 3, name: "other", symbol: "Other" },
                    ]}
                    placeholder="Select Transmission Type"
                />
            );
        }

        if (attribute.name.toLowerCase() === "kilometers") {
            // If attribute is kilometers, show number input
            return (
                <InputField
                    label={attribute.name}
                    value={formData.attributes[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    id={attribute.id}
                    name={attribute.id}
                    type="number"
                    placeholder={`Enter ${attribute.name}`}
                />
            );
        }

        // Default case, show text input for other attributes
        return (
            <InputField
                label={attribute.name}
                value={formData.attributes[attribute.id] || ""}
                onChange={(e) => handleAttributeChange(e, attribute.id)}
                id={attribute.id}
                name={attribute.id}
                type="text"
                placeholder={`Enter ${attribute.name}`}
            />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {attributes.map((attribute) => (
                    <div key={attribute.id}>
                        {renderInputField(attribute)}
                    </div>
                ))}
            </div>
        </div>
    );
}
