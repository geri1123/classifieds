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
"use client"; // This must be a Client Component because of useState/useEffect

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
  const limit = 10; // Items per page

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts(page, limit);
      setProducts(data.products);
      setTotal(data.total);
    }
    loadProducts();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1>Products Page</h1>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}

      {/* Pagination Controls */}
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span> Page {page} of {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
