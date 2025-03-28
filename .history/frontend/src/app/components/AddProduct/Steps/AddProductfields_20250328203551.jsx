import FirstInputs from "@/components/AddProduct/SteperComponents/FirstInputs";
import UploadProductImg from "@/components/AddProduct/SteperComponents/UploadProductImg";
import AddProtuctAtrributes from "@/components/AddProduct/SteperComponents/AddProductAttributes";
export default function AddPProductFields ({ changeHandler,setFormData, formData,subcategoriesItem, categories, subcategories}){
       // Find selected category
       const selectedCategory = categories.find(cat => String(cat.id) === String(formData.category_id));

       // Find selected subcategory
       const selectedSubcategory = subcategories.find(sub => String(sub.id) === String(formData.subcategory_id));
       const selectedSubcategoryItem = subcategoriesItem.find(item => String(item.id) === String(formData.subcategory_item_id));
    return (
        <div className="w-full flex flex-col gap-4 ">
            <div className="w-full bg-gray-100 rounded-xl p-4">
         <h2>
                {selectedCategory ? selectedCategory.name : "No Category Selected"} /
                {selectedSubcategory ? selectedSubcategory.name : "No Subcategory Selected"}/
                {selectedSubcategoryItem ? selectedSubcategoryItem.name : ""}
            </h2>
            </div>
            <div className="bg-gray-100 w-full p-4 rounded-xl">

            
            <FirstInputs formData={formData} changeHandler={changeHandler} /> 
            
            </div>
            <div className="bg-gray-100 w-full p-4 rounded-xl">
            <UploadProductImg setFormData={setFormData} formData={formData} changeHandler={changeHandler}/>
            </div>
            <div className="bg-gray-100 w-full p-4 rounded-xl">
            <AddProtuctAtrributes setFormData={setFormData} formData={formData} changeHandler={changeHandler}/>
            </div>
            <div className="bg-gray-100 w-full p-4 rounded-xl">
            <AddProtuctAtrributes setFormData={setFormData} formData={formData} changeHandler={changeHandler}/>
            </div>
        </div>
    )
}