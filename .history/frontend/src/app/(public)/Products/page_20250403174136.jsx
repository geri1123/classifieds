// import React from 'react';

// async function fetchProducts() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);
//     const data = await res.json();
//     console.log('Fetched products:', data);  // Log the full response
//     return data.products || [];  // Ensure to extract the products array
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return [];  // Return empty array if error occurs
//   }
// }

// // The Products page component
// export default async function Products() {
//   const products = await fetchProducts();  // Fetch products

//   return (
//     <div>
//       <h1>Products Page</h1>
//       {products.length > 0 ? (
//         <ul>
//           {products.map((product) => (
//             <li key={product.id}>
//               <h2>{product.title}</h2>
//               <p>Category: {product.category_name}</p>
//               <p>Subcategory: {product.subcategory_name}</p>
//               <p>Subcategory Item: {product.subcategory_item_name}</p>
//               <div>
//                 {product.images.map((image, index) => (
//                   <img key={index} src={image} alt={product.title} width={100} />
//                 ))}
//               </div>
//               <div>
//                 <h3>Price: {product.currency} {product.price}</h3>
//                 <p>{product.description}</p>
//               </div>
//               <div>
//                 <h3>Seller:</h3>
//                 <p>{product.seller_username}</p>
                
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No products found.</p>
//       )}
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';

async function fetchProducts(page = 1, limit = 10) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?page=${page}&limit=${limit}`);
    const data = await res.json();
    console.log('Fetched products:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10; // Items per page
  
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await fetchProducts(page, limit);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setLoading(false);
    }
    loadProducts();
  }, [page]);
  
  const totalPages = Math.ceil(total / limit);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Products Page</h1>
      
      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">No products found.</div>
      )}
      
      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex justify-between items-center mt-8">
          <button 
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          
          <span>Page {page} of {totalPages}</span>
          
          <button 
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}