import InputField from "@/components/ui/InputField"
export default function FirstInputs(){
    return(
        <div className="first-inputs">
            <div className="form-group max-w-100 ">
               <InputField
               label="Title"
               name="title"
               value={formData.title}
               onChange={changeHandler}
               placeholder="Title"
               />
            </div>
        </div>
    )
}