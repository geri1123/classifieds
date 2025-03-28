import SelectInput from "@/components/ui/SelectInput";
import InputField from "@/components/ui/InputField"; // Assuming you have an InputField component

export default function ProductAddress({ setFormData, formData, changeHandler }) {
    const albanianCities = [
        { id: 1, name: "Tirana" },
        { id: 2, name: "Shkodra" },
        { id: 3, name: "Vlora" },
        { id: 4, name: "Fier" },
        { id: 5, name: "Elbasan" },
        { id: 6, name: "Durrës" },
        { id: 7, name: "Korçë" },
        { id: 8, name: "Gjirokastër" },
    ];

    // Check if cities are correctly populated
    console.log(albanianCities);

    return (
        <div className="product-address flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Location</h2>

            {/* Country Select Input */}
            <div>
                <SelectInput
                    label="Country"
                    value={formData.country}  // Since it's fixed to Albania
                    onChange={changeHandler}  // Assuming you don't need to update this value
                    name="country"
                    options={[{ id: 1, name: "Albania", symbol: "Albania" }]}
                    placeholder="Country"
                    disabled // Since the country is fixed to Albania
                />
            </div>

            {/* City Select Input */}
            <div>
                <SelectInput
                    label="City"
                    value={formData.city || ""}
                    onChange={(e) => changeHandler(e)}  // Assuming changeHandler updates the formData
                    name="city"
                    options={albanianCities}  // Populating cities (Qarku) of Albania
                    placeholder="Select City"
                />
            </div>

            {/* Address Input */}
            <div>
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