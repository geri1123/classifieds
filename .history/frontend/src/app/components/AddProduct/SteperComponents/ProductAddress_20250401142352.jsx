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
import SelectInput from "@/components/ui/SelectInput";
import InputField from "@/components/ui/InputField";
import { fetchCountries, fetchCities } from "../../path-to-your-redux-slice"; // Adjust the import path

export default function ProductAddress({ formData, changeHandler, errors }) {
    const dispatch = useDispatch();
    const { countries, cities, loading } = useSelector((state) => state.category);
    
    // Fetch countries when component mounts
    useEffect(() => {
        dispatch(fetchCountries());
    }, [dispatch]);
    
    // Fetch cities when country changes
    useEffect(() => {
        if (formData.country) {
            // Find the country_id based on the selected country name
            const selectedCountry = countries.find(country => country.name === formData.country);
            if (selectedCountry) {
                dispatch(fetchCities(selectedCountry.id));
            }
        }
    }, [dispatch, formData.country, countries]);

    return (
        <div className="product-address flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Location</h2>
            
            {/* Country Select Input */}
            <div className="max-w-100">
                <SelectInput
                    label="Country"
                    value={formData.country || ''}
                    onChange={changeHandler}
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
                    disabled={!formData.country || cities.length === 0}
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
                    errors={errors.address || ''}
                />
            </div>
        </div>
    );
}