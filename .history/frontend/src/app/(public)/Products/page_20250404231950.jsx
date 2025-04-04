// import ProductCard from "@/components/ProductCard/ProductCard";

// async function fetchProducts() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/all-products`, {
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch products");
//     }

//     const data = await response.json();
//     return data.products || data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw error; // Re-throw the error after logging it
//   }
// }

// export default async function ProductPage() {
//   let products = [];

//   try {
//     products = await fetchProducts();
//   } catch (error) {
//     console.error("Error loading products:", error);
//   }

//   return (
//     <div className="grid grid-cols-5 gap-4">
//       {products.length > 0 ? (
//         products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))
//       ) : (
//         <p>No products found.</p>
//       )}
//     </div>
//   );
// }
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
async function fetchProducts(page, limit) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/all-products?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Re-throw the error after logging it
  }
}

export default async function ProductPage({ searchParams }) {
  const urlSearchParams = new URLSearchParams(searchParams);
  const page = parseInt(urlSearchParams.get('page')) || 1;
  const limit = 10;

  const data = await fetchProducts(page, limit);
  const products = data.products;
  const totalPages = Math.ceil(data.total / limit);

  return (
    <div>
      <div className="grid grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}