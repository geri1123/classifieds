
export default async function ProductPage(){
  const response = await fetch('/api/products',{
    cache:"no-store",
  });
const products = await response.json();
    return(
        <div>
            {products.map((product)=>(
                <div key={product.id}>
                    <h1>{product.name}</h1>
                    <p>{product.price}</p>
                </div>
            ))}
        </div>
    )

}