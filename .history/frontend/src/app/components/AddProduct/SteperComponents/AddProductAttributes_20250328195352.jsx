import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributes } from "@redux/categorySlice";
import InputField from "@/components/ui/InputField";
import SelectInput from "@/components/ui/SelectInput"; // Assuming SelectInput is a reusable component

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

    // Function to render the correct input type for attributes
    const renderInputField = (attribute) => {
        if (attribute.name.toLowerCase() === "condition") {
            // If attribute is condition, show dropdown
            return (
                <SelectInput
                    label={attribute.name}
                    value={formData.attributes[attribute.id] || ""}
                    onChange={(e) => handleAttributeChange(e, attribute.id)}
                    name={attribute.id}
                    options={[
                        { id: 1, name: "new", symbol: "New" },
                        { id: 2, name: "used", symbol: "Used" },
                    ]}
                    placeholder="Select Condition"
                />
            );
        }
        if (
            [
                "build year",
                "bedrooms",  // Ensure the name matches exactly as in your attribute
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

    return (
        <div className="bg-gray-100 w-full p-4 rounded-xl">
            <h2 className="text-xl font-semibold">Product Attributes</h2>
            {attributes && attributes.length > 0 ? (
                attributes.map((attribute) => (
                    <div key={attribute.id} className="mb-4">
                        {renderInputField(attribute)}
                    </div>
                ))
            ) : (
                <p>No attributes available for this subcategory.</p>
            )}
        </div>
    );
}
