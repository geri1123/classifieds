
"use client"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchSubcategories, fetchSubcategoryItems } from "@redux/categorySlice";

export default function SelectCategory({ formData, changeHandler, setFormData }) {
    const dispatch = useDispatch();
    const { categories, subcategories, subcategoriesItem, loading } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (formData.category_id) {
            dispatch(fetchSubcategories(formData.category_id)); // Dispatch with category_id
            setFormData((prevData) => ({ ...prevData, subcategory_id: '' }));
        }
    }, [dispatch, formData.category_id]);

    useEffect(() => {
        if (formData.subcategory_id) {
            dispatch(fetchSubcategoryItems(formData.subcategory_id));
            setFormData((prevData) => ({ ...prevData, subcategory_item_id: '' }));
        }
    }, [dispatch, formData.subcategory_id]);

    return (
        <div className="select-category flex flex-col border-2 border-yellow-40 gap-3 w-full rounded-xl p-4 px-4">
            <h2>Please select a listing type and category for your listing.</h2>
            <div className="w-full flex flex-col">
                {/* Categories section */}
                {loading ? (
                    <p>Loading categories...</p>
                ) : (
                    categories.map((category) => (
                        <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category_id"
                                value={category.id}
                                checked={String(formData.category_id) === String(category.id)}
                                onChange={changeHandler}
                                className="peer hidden"
                            />
                            <div className="w-5 h-5 border-2 border-gray-500 rounded-full peer-checked:bg-yellow-400"></div>
                            <span>{category.name}</span>
                        </label>
                    ))
                )}

                {/* Subcategories section */}
                {formData.category_id && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Select subcategory</h3>
                        <div className="flex flex-wrap items-start gap-3">
                            {subcategories
                                .filter((sub) => String(sub.category_id) === String(formData.category_id) && !sub.parent_id)
                                .map((sub) => (
                                    <button
                                        key={sub.id}
                                        type="button"
                                        name="subcategory_id"
                                        value={sub.id}
                                        onClick={() => changeHandler({ target: { name: "subcategory_id", value: sub.id } })}
                                        className={`px-4 py-2 border-2 rounded-lg text-lg cursor-pointer transition-all
                                            ${formData.subcategory_id === sub.id
                                                ? "bg-yellow-400 text-black border-yellow-500"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {sub.name}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

                {/* Subcategory Items section */}
                {formData.subcategory_id && subcategoriesItem.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Select Subcategory Item</h3>
                        <div className="flex flex-wrap gap-3">
                            {subcategoriesItem.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    name="subcategory_item_id"
                                    value={item.id}
                                    onClick={() => changeHandler({ target: { name: "subcategory_item_id", value: item.id } })}
                                    className={`px-2 py-2 border-2 text-sm rounded-lg text-lg cursor-pointer transition-all
                                        ${formData.subcategory_item_id === item.id
                                            ? "bg-yellow-400 text-black border-yellow-500"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
