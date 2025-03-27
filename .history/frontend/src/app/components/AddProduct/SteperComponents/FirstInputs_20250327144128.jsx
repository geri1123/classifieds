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
        <div className="first-inputs flex flex-col gap-2">
            <div className="form-group max-w-100">
                <InputField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={changeHandler}
                    placeholder="Title"
                />
            </div>
            <div className="flex items-center ">

        
            <div className="form-group max-w-30">
                <SelectInput
                    label="Currency"
                    name="currency"
                    value={formData.currency} 
                    onChange={changeHandler}
                    options={currencyOptions} 
                    placeholder="Select Currency"
                />
            </div>
            <div className="">

           
            <InputField 
                label="Price (Product price & Salery)"
                name="title"
                value={formData.title}
                onChange={changeHandler}
                placeholder="Title"
                />
</div>
        
            </div>
        </div>
    );
}