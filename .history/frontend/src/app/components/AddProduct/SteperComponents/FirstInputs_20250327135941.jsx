import InputField from "@/components/ui/InputField";
import SelectInput from "@/components/ui/SelectInput";
export default function FirstInputs({ formData, changeHandler }) {
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
                    label="Subcategory"
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={changeHandler}
                    options={subcategories}
                    placeholder="Select a Subcategory"
                />
            </div>
        </div>
    );
}