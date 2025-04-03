import ProductCard from "@/components/ProductCard/ProductCard";
export default async function ProductPage(){
  let products = [];

try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  products = data.products || data; 
} catch (error) {
  console.error("Error loading products:", error);
}

    return(
        <div>
          {products && products.map(product => (
  <div key={product.id}>
    <h1>{product.category_name}</h1>
    <p>{product.title}</p>
  </div>
))}
        </div>
    )

}