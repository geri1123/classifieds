import SelectInput from "@/components/ui/SelectInput";
import InputField from "@/components/ui/InputField";

export default function ProductAddress({ setFormData, errorMessage,formData, changeHandler }) {
    // List of cities in Albania
    const albanianCities = [
        { id: 1, name: "Tirana", symbol: "Tirana"},
        { id: 2, name: "Shkodra" , symbol: "Shkodra"},
        { id: 3, name: "Vlora" , symbol: "Vlora"},
        { id: 4, name: "Fier" , symbol: "Fier"},
        { id: 5, name: "Elbasan" , symbol: "Elbasan"},
        { id: 6, name: "Durrës" , symbol: "Durrës"},
        { id: 7, name: "Korçë" , symbol: "Korçë"},
        { id: 8, name: "Gjirokastër" , symbol: "Gjirokastër"},
    ];

   

    return (
        <div className="product-address flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Location</h2>

            {/* Country Select Input */}
            <div className="max-w-100">
                <SelectInput
                    label="Country"
                    value={formData.country ||''}  
                    onChange={changeHandler} 
                    name="country"
                    options={[{ id: 1, name: "Albania", symbol: "Albania" }]} 
                    placeholder="Country"
                    
                />
                
            </div>

            {/* City Select Input */}
            <div className="max-w-100">
                <SelectInput
                    label="City"
                    value={formData.city || ""}  
                    onChange={changeHandler}  
                    name="city"
                    options={albanianCities}  
                    placeholder="Select City"
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
                />
            </div>
        </div>
    );
}
