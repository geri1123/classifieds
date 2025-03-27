import InputField from "@/components/ui/InputField";
import SelectInput from "@/components/ui/SelectInput";

export default function FirstInputs({ formData, changeHandler }) {
    // Define the currency options with their symbols and names
    const currencyOptions = [
        { id: 'eur', name: 'Euro', symbol: '€' },
        { id: 'lek', name: 'Lek', symbol: 'Lek' },
        { id: 'usd', name: 'Dollar', symbol: '$' },
    ];

    return (
        <div className="first-inputs">
            <div className="form-group max-w-100">
                <InputField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={changeHandler}
                    placeholder="Title"
                />
            </div>
            <div className="form-group max-w-100">
                <SelectInput
                    label="Currency"
                    name="currency"
                    value={formData.currency} // This holds the selected currency name
                    onChange={changeHandler}
                    options={currencyOptions} // Pass the currency options with symbol and name
                    placeholder="Select Currency"
                />
            </div>
        </div>
    );
}