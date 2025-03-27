export default function AddPProductFields ({ changeHandler, formData,subcategoriesItem, categories, subcategories}){
       // Find selected category
       const selectedCategory = categories.find(cat => String(cat.id) === String(formData.category_id));

       // Find selected subcategory
       const selectedSubcategory = subcategories.find(sub => String(sub.id) === String(formData.subcategory_id));
       const selectedSubcategoryItem = subcategoriesItem.find(item => String(item.id) === String(formData.subcategory_item_id));
    return (
        <>
         <h2>
                {selectedCategory ? selectedCategory.name : "No Category Selected"} /
                {selectedSubcategory ? selectedSubcategory.name : "No Subcategory Selected"}/
                {selectedSubcategoryItem ? selectedSubcategoryItem.name : ""}
            </h2>
           

            <div className="form-group">
                <label htmlFor="title">Name</label>
                <input type="text" className="form-control" id="title" name="title" placeholder="Enter name" />
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
        </>
    )
}