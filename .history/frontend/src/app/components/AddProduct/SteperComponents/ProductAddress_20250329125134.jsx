import SelectInput from "@/components/ui/SelectInput";
import InputField from "@/components/ui/InputField";

export default function ProductAddress({ setFormData, formData, changeHandler }) {
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
            <div className="w-100">
                <SelectInput
                    label="Country"
                    value={formData.country ||''}  // Since it's fixed to Albania
                    onChange={changeHandler}  // Assuming you don't need to update this value
                    name="country"
                    options={[{ id: 1, name: "Albania", symbol: "Albania" }]} // Albania is the only option
                    placeholder="Country"
                    disabled // Since the country is fixed to Albania
                />
            </div>

            {/* City Select Input */}
            <div className="w-100">
                <SelectInput
                    label="City"
                    value={formData.city || ""}  // Ensure empty string if undefined
                    onChange={changeHandler}  // Assuming changeHandler updates the formData
                    name="city"
                    options={albanianCities}  // Populating cities (Qarku) of Albania
                    placeholder="Select City"
                />
            </div>

            {/* Address Input */}
            <div className="w-100">
                <InputField
                    label="Address"
                    name="address"
                    value={formData.address || ""} // Ensure empty string if undefined
                    onChange={changeHandler}
                    placeholder="Enter address"
                />
            </div>
        </div>
    );
}
