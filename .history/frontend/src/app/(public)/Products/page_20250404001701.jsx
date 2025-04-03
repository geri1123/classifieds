
export default async function ProductPage(){
  const response = await fetch('/api/Products',{
    cache:"no-store",
  });
const products = await response.json();
    return(
        <div>
            {products.map((product)=>(
                <div key={product.id}>
                    <h1>{product.category_name}</h1>
                    <p>{product.title}</p>
                </div>
            ))}
        </div>
    )

}