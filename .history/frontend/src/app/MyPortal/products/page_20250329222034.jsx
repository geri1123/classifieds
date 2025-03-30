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
// app/MyPortal/products/page.jsx (Server Component)
// app/MyPortal/products/page.jsx
// app/MyPortal/products/page.jsx
import ProductsByCategory from '@/components/UserProducts/ProductsByCategory';

export const dynamic = 'force-dynamic';

// Define the generateMetadata function to properly handle searchParams
export async function generateMetadata({ searchParams }) {
  return {
    title: `Products - ${searchParams?.category || 'All'}`
  };
}

// Use a simpler pattern that avoids the searchParams issue
export default async function ProductsPage({ params, searchParams }) {
  // Extract category directly from the function parameters
  const category = String(searchParams?.category || 'All');
  
  // Fetch the data
  const data = await fetchProducts(category);
  
  // Return the component with the fetched data
  return (
    <ProductsByCategory
      products={data?.success ? data.products : []}
      error={data?.error}
      category={category}
    />
  );
}

async function fetchProducts(category) {
  try {
    console.log(`Fetching products with category: ${category}`);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${category}`,
      {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        next: { revalidate: 0 } // Ensure fresh data on each request
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error.message);
    return { 
      success: false, 
      products: [], 
      error: error.message || 'Failed to fetch products' 
    };
  }
}