import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributes } from "@redux/categorySlice";

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
            <h2 className="text-xl font-semibold">Product Attributes</h2>
            {attributes && attributes.length > 0 ? (
                attributes.map((attribute) => (
                    <div key={attribute.id} className="mb-4">
                        <label htmlFor={attribute.id} className="block text-lg">{attribute.name}</label>
                        <input
                            type="text"
                            id={attribute.id}
                            name={attribute.id}
                            value={formData.attributes[attribute.id] || ""} // Bind input value to formData
                            onChange={(e) => handleAttributeChange(e, attribute.id)}
                            className="w-full p-2 border-2 rounded-lg mt-1"
                            placeholder={`Enter ${attribute.name}`}
                        />
                    </div>
                ))
            ) : (
                <p>No attributes available for this subcategory.</p>
            )}
        </div>
    );
}
