export default function SelectCategory(){
    return(
        <div className="select-category">
            <select name="category" id="category">
                <option value="all">All</option>
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelery</option>
                <option value="men's clothing">Men's clothing</option>
                <option value="women's clothing">Women's clothing</option>
            </select>
        </div>
    )
}