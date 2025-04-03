import InputField from "@/components/ui/InputField"
export default function AddUserInfo ({ errors, formData,changeHandler}){
    return (
        <div className="add-user-info">
            <div className="form-group max-w-100">
                <InputField
                    label={<span>First Name </span>}
                    name="user_firstname"
                    value={formData.user_firstname}
                    onChange={changeHandler}
                    placeholder="First Name"
                    errors={errors.user_firstname}
                />
            </div>
            <div className="form-group max-w-100">
                <InputField
                    label={<span>Last Name </span>}
                    name="user_lastname"
                    value={formData.user_lastname}
                    onChange={changeHandler}
                    placeholder="Last name"
                    errors={errors.user_lastname}
                 
                />
            </div>
            <div className="form-group max-w-100">
                <InputField
                    label={<span>Email </span>}
                    name="user_email"
                    value={formData.user_email}
                    onChange={changeHandler}
                    placeholder="Email"
                    errors={errors.user_email}
                />
            </div>
            <div className="form-group max-w-100">
                <InputField
                    label={<span>Phone </span>}
                    name="user_phone"
                    value={formData.user_phone}
                    onChange={changeHandler}
                    placeholder="Phone number"
                    errors={errors.user_phone}
                />
            </div>
        </div>
    )
}