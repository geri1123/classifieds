"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';

// Accept the fetchProductsAction as a prop
export function ProductsComponent({ fetchProductsAction }) {
  // State management
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const limit = 10;
  
//   // Data fetching with useEffect
//   useEffect(() => {
//     let isMounted = true;
    
//     async function loadProducts() {
//       setLoading(true);
//       try {
//         // Call the server action
//         const data = await fetchProductsAction(limit);
        
//         // Only update state if component is still mounted
//         if (isMounted) {
//           setProducts(data.products || []);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     }
    
//     loadProducts();
    
//     // Cleanup function
//     return () => {
//       isMounted = false;
//     };
//   }, [fetchProductsAction]);

//   // UI rendering
//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-8">Products Page</h1>
      
//       {loading ? (
//         <div className="text-center py-8">Loading products...</div>
//       ) : products.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-8">No products found.</div>
//       )}
//     </div>
  );
}
