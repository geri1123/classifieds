export default function products{
    return(
        <div className="product">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
        </div>
    )

}