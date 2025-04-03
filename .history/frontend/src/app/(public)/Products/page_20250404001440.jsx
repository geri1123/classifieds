
export default async function ProductPage(){
  const response = await fetch('/api/products',{
    cache:"no-store",
  });
const products = await response.json();
    return(
        <div>
            <h1>Product Page</h1>
        </div>
    )

}