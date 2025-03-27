export default function AddPProductFields ({changeHandler ,formDataset,formData}){
    return (
        <>
        <h2>{formData.category}/{formData.subcategory_id}</h2>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name" name="name" placeholder="Enter name" />
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