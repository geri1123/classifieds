import InputField from "@/components/ui/InputField"
export default function AddUserInfo ({setFormData,formData,changeHandler}){
    return (
        <div className="add-user-info">
            <div className="form-group max-w-100">
                <InputField
                    label={<span>First name </span>}
                    name="user_firstname"
                    value={formData.user_firstname}
                    onChange={changeHandler}
                    placeholder="First Name"
                />
            </div>
        </div>
    )
}