import InputField from "@/components/ui/InputField";
import SelectInput from "@/components/ui/SelectInput";

export default function FirstInputs({ formData,errors, changeHandler }) {
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
                    label={<span>Title <span className="text-red-500">*</span></span>}
                    name="title"
                    value={formData.title}
                    onChange={changeHandler}
                    placeholder="Title"
                    errors={errors.title}
                
                />
            </div>
            <div className="flex items-center gap-3 max-w-100 ">

        
            <div className="form-group w-1/4">
                <SelectInput
                    label={<span>Currency <span className="text-red-500">*</span></span>}
                    name="currency"
                    value={formData.currency || "Euro"} 
                    onChange={changeHandler}
                    options={currencyOptions} 
                    placeholder="Select Currency"
                   errors={errors.currency}
                />
            </div>
            {errors.price && (<div className="mt-2"></div>)}
            <div className="w-3/4">

           
            <InputField 
                label={<span>Price (Product price & Salery) <span className="text-red-500">*</span></span>}
                name="price"
                value={formData.price}
                onChange={changeHandler}
                type="number"
                placeholder="Price (example 1000....)"
               errors={errors.price}
                />
            </div>
        
            </div>
            <div className="max-w-100 flex flex-col ">
                <label className="block mb-2 text-gray-700 dark:text-gray-200" htmlFor="description">Description <span className="text-red-500">*</span></label>
              
                <textarea name="description" onChange={changeHandler} placeholder="Product or Job description" value={formData.description} className="form-control" id="description">

                </textarea>
                {errors.description && <p className="text-sm text-red-600 ">{errors.description}</p>}
                
            </div>
        </div>
    );
}