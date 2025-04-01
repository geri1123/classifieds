// import SelectInput from "@/components/ui/SelectInput";
// import InputField from "@/components/ui/InputField";

// export default function ProductAddress({ setFormData,errors,formData, changeHandler }) {
//     // List of cities in Albania
//     const albanianCities = [
//         { id: 1, name: "Tirana", symbol: "Tirana"},
//         { id: 2, name: "Shkodra" , symbol: "Shkodra"},
//         { id: 3, name: "Vlora" , symbol: "Vlora"},
//         { id: 4, name: "Fier" , symbol: "Fier"},
//         { id: 5, name: "Elbasan" , symbol: "Elbasan"},
//         { id: 6, name: "Durrës" , symbol: "Durrës"},
//         { id: 7, name: "Korçë" , symbol: "Korçë"},
//         { id: 8, name: "Gjirokastër" , symbol: "Gjirokastër"},
//     ];

   

//     return (
//         <div className="product-address flex flex-col gap-3">
//             <h2 className="text-lg font-semibold">Location</h2>

//             {/* Country Select Input */}
//             <div className="max-w-100">
//                 <SelectInput
//                     label="Country"
//                     value={formData.country ||''}  
//                     onChange={changeHandler} 
//                     name="country"
//                     options={[{ id: 1, name: "Albania", symbol: "Albania" }]} 
//                     placeholder="Country"
//                     errors={errors.country}
//                 />
                
//             </div>

//             {/* City Select Input */}
//             <div className="max-w-100">
//                 <SelectInput
//                     label="City"
//                     value={formData.city || ""}  
//                     onChange={changeHandler}  
//                     name="city"
//                     options={albanianCities}  
//                     placeholder="Select City"
//                     errors={errors.city}
//                 />
//             </div>

//             {/* Address Input */}
//             <div className="max-w-100">
//                 <InputField
//                     label="Address"
//                     name="address"
//                     value={formData.address || ""} 
//                     onChange={changeHandler}
//                     placeholder="Enter address"
//                     errors=''
//                 />
//             </div>
//         </div>
//     );
// }
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, fetchCities } from "@redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributes } from "@redux/categorySlice";
import SelectInput from "@/components/ui/SelectInput";
import InputField from "@/components/ui/InputField";

export default function ProductAddress({ setFormData, errors, formData, changeHandler }) {
    const dispatch = useDispatch();

    // Get countries and cities from Redux store
    const { countries, cities, loading } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchCountries()); // Fetch countries when component mounts
    }, [dispatch]);

    useEffect(() => {
        if (formData.country) {
            dispatch(fetchCities(formData.country)); // Fetch cities when country changes
        }
    }, [dispatch, formData.country]);

    return (
        <div className="product-address flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Location</h2>

            {/* Country Select Input */}
            <div className="max-w-100">
                <SelectInput
                    label="Country"
                    value={formData.country || ""}
                    onChange={(e) => {
                        changeHandler(e);
                        setFormData({ ...formData, city: "" }); // Reset city when country changes
                    }}
                    name="country"
                    options={countries}
                    placeholder="Select Country"
                    errors={errors.country}
                />
            </div>

            {/* City Select Input */}
            <div className="max-w-100">
                <SelectInput
                    label="City"
                    value={formData.city || ""}
                    onChange={changeHandler}
                    name="city"
                    options={cities}
                    placeholder="Select City"
                    errors={errors.city}
                    disabled={!formData.country} // Disable city selection if no country is selected
                />
            </div>

            {/* Address Input */}
            <div className="max-w-100">
                <InputField
                    label="Address"
                    name="address"
                    value={formData.address || ""}
                    onChange={changeHandler}
                    placeholder="Enter address"
                    errors=""
                />
            </div>
        </div>
    );
}
