import InputField from "@/components/ui/InputField"
export default function AddUserInfo ({setFormData, errors, formData,changeHandler}){
    return (
        <div className="add-user-info">
            <div className="form-group max-w-100">
                <InputField
                    label={<span>First Name </span>}
                    name="user_firstname"
                    value={formData.user_firstname}
                    onChange={changeHandler}
                    placeholder="First Name"
                  
                />
            </div>
            <div className="form-group max-w-100">
                <InputField
                    label={<span>Last Name </span>}
                    name="user_lastname"
                    value={formData.user_lastname}
                    onChange={changeHandler}
                    placeholder="Last name"
                 
                />
            </div>
            <div className="form-group max-w-100">
                <InputField
                    label={<span>Email </span>}
                    name="user_email"
                    value={formData.user_email}
                    onChange={changeHandler}
                    placeholder="Email"
                />
            </div>
            <div className="form-group max-w-100">
                <InputField
                    label={<span>Phone </span>}
                    name="user_phone"
                    value={formData.user_phone}
                    onChange={changeHandler}
                    placeholder="Phone number"
                />
            </div>
        </div>
    )
}