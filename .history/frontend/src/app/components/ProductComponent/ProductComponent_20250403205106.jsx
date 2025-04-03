// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import ProductCard from "@/components/ProductCard/ProductCard";

// export function ProductsComponent({ fetchProductsAction }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Use useCallback to memoize the loadProducts function
//   const loadProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       console.log("Fetching products...");
//       const productsData = await fetchProductsAction();
//       console.log("Products received:", productsData);
//       setProducts(productsData? productsData : []);
//     } catch (error) {
//       console.error("Error loading products:", error);
//       setError("Failed to load products. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   }, [fetchProductsAction]);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   if (loading) return <p className="text-center py-8">Loading products...</p>;
//   if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-8">Products</h1>
      
//       {products.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-center py-8">No products found.</p>
//       )}
      
//       {/* Add a debug button during development */}
//       <button 
//         onClick={loadProducts}
//         className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//       >
//         Reload Products
//       </button>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useSearchParams } from "next/navigation";

export function ProductsComponent({ fetchProductsAction, initialProducts = [], category }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(!initialProducts.length);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const ITEMS_PER_PAGE = 12;
  
  // Use useCallback to memoize the loadProducts function
  const loadProducts = useCallback(async () => {
    if (initialProducts.length && currentPage === 1) {
      setProducts(initialProducts);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const productsData = await fetchProductsAction(category, currentPage, ITEMS_PER_PAGE);
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [fetchProductsAction, initialProducts, category, currentPage, ITEMS_PER_PAGE]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, currentPage, category]);

  // Handling pagination
  const totalPages = Math.ceil((products.length || ITEMS_PER_PAGE) / ITEMS_PER_PAGE);
  
  if (loading) return <p className="text-center py-8">Loading products...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        {category ? `${category} Products` : "All Products"}
      </h1>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center py-8">No products found.</p>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav aria-label="Product pagination">
            <ul className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <a
                    href={`?page=${page}`}
                    className={`px-4 py-2 rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
