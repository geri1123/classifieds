import FirstInputs from "../SteperComponents/FirstInputs";
export default function AddPProductFields ({ changeHandler, formData,subcategoriesItem, categories, subcategories}){
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
            </div>
            <div className="form-group">
                <label htmlFor="price">Price</label>
                <input type="number" className="form-control" id="price" name="price" placeholder="Enter price" />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea className="form-control" id="description" name="description" rows="3" placeholder="Enter description"></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="image">Image</label>
                <input type="file" className="form-control-file" id="image" name="image" />
            </div>
        </div>
    )
}