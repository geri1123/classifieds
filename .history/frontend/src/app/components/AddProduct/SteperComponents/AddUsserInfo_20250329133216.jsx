import InputField from "@/components/ui/InputField"
export default function AddUserInfo ({setFormData,formData,changeHandler}){
    return (
        <div className="add-user-info">
            <div className="form-group max-w-100">
                <InputField
                    label={<span>Title <span className="text-red-500">*</span></span>}
                    name="title"
                    value={formData.title}
                    onChange={changeHandler}
                    placeholder="Title"
                />
            </div>
        </div>
    )
}