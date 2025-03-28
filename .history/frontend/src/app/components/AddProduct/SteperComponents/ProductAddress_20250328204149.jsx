import SelectInput from "@/components/ui/SelectInput"
export default function ProductAddress ({setFormData,formData,changeHandler}){
    return(
        <div className="product-address flex flex-col gap-3">

            <h2 className="text-lg font-semibold">Location</h2>
        <div>
            <SelectInput
             placeholder="Country"
             
            />
        </div>
        </div>
    )
}