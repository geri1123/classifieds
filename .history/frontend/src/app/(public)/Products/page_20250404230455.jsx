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
"use client"
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";

async function fetchProducts(page, limit) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/all-products?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.products || data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Re-throw the error after logging it
  }
}

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await fetchProducts(page, limit);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }

    loadProducts();
  }, [page, limit]);

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
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}