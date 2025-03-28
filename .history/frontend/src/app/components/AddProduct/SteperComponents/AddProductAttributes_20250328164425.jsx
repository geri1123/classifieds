import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributes } from "@redux/categorySlice";
import InputField from "@/components/ui/InputField";
export default function AddProductAttributes({ formData, setFormData }) {
    const dispatch = useDispatch();
    const { attributes } = useSelector((state) => state.category);

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

    return (
        <div className="bg-gray-100 w-full p-4 rounded-xl">
            <h2 className="text-xl font-semibold"></h2>
            {attributes && attributes.length > 0 ? (
                attributes.map((attribute) => (
                    <div key={attribute.id} className="mb-4">
                        <InputField
                            label={attribute.name} // Attribute name as label
                            value={formData.attributes[attribute.id] || ""} // Bind input value to formData
                            onChange={(e) => handleAttributeChange(e, attribute.id)} // Pass onChange handler
                            id={attribute.id} // Set ID for the input field
                            name={attribute.id} // Use attribute ID as name
                            type="text" // Use text type for attribute value
                            placeholder={`Enter ${attribute.name}`} // Dynamic placeholder based on attribute
                            errors={null} // Add error handling if necessary
                        />
                    </div>
                ))
            ) : (
                <p>No attributes available for this subcategory.</p>
            )}
        </div>
    );
}
