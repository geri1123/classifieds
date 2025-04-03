
export default async function ProductPage(){
  const response = await fetch('/api/products');
    return(
        <div>
            <h1>Product Page</h1>
        </div>
    )

}