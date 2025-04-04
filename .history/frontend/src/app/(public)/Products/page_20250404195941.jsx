// import ProductCard from "@/components/ProductCard/ProductCard";
// export default async function ProductPage(){
//   let products = [];

// try {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch products");
//   }

//   const data = await response.json();
//   products = data.products || data; 
// } catch (error) {
//   console.error("Error loading products:", error);
// }

//     return(
//         <div className="grid grid-cols-5 gap-4">
//           {products && products.map(product => (
 
//             <ProductCard key={product.id} product={product}/>
// ))}
//         </div>
//     )

// }
import { Suspense } from 'react';
import ProductCard from "@/components/ProductCard/ProductCard";

// Loading component to show while products are being fetched
function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="text-center py-10">Loading products...</div>
    </div>
  );
}

// Isolated component to handle the products grid
function ProductsGrid({ products }) {
  if (products.length === 0) {
    return <div className="text-center py-10">No products found</div>;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function ProductPage() {
  let products = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const data = await response.json();
    products = Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error("Error loading products:", error);
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <Suspense fallback={<ProductsLoading />}>
        <ProductsGrid products={products} />
      </Suspense>
    </div>
  );
}