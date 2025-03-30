// 'use client';
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const searchParams = useSearchParams();
//   const category = searchParams.get('category') || 'All';

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${category}`,
//           {
//             method: 'GET',
//             credentials: 'include',
//             cache: 'no-store'
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP Error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setProducts(data.success ? data.products : []);
//       } catch (err) {
//         console.error('Fetch error:', err.message);
//         setError('Failed to fetch products');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, [category]);

//   if (loading) return <div>Loading products...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h1>Your {category} Products</h1>
//       {products.length === 0 ? (
//         <p>No products found in this category</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {products.map((product) => (
//             <div key={product.id} className="border p-4 rounded-lg">
//               {product.images && product.images.length > 0 ? (
//                 <img 
//                   src={product.images[0]} 
//                   alt={product.title} 
//                   className="w-full h-48 object-cover mb-2"
//                 />
//               ) : (
//                 <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-2">
//                   No Image
//                 </div>
//               )}
//               <h2 className="text-lg font-bold">{product.title}</h2>
//               <p className="text-gray-600">{product.category_name} / {product.subcategory_name}</p>
//               <p className="font-semibold mt-2">{product.price} {product.currency}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import ProductsByCategory from '@/components/UserProducts/ProductsByCategory';

export const dynamic = 'force-dynamic'; // Ensures fresh data on every request

async function fetchProducts(category) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${encodeURIComponent(category)}`,
      { credentials: 'include', headers: { 'Content-Type': 'application/json' }, cache: 'no-store' }
    );

    if (!res.ok) throw new Error(`Error fetching products: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, products: [], error: error.message };
  }
}

export default async function ProductsPage({ params }) {
  if (!params?.category) return <div>Loading...</div>; // ✅ Prevents crash

  const category = decodeURIComponent(params.category || 'All');
  const data = await fetchProducts(category);

  return <ProductsByCategory products={data.products || []} error={data.error} category={category} />;
}
