// 'use client';
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import ProductsByCategory from '@/components/UserProducts/ProductsByCategory';

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

//   return <ProductsByCategory category={category} products={products}/>;
//     }
import ProductsByCategory from '@/components/UserProducts/ProductsByCategory';
import { getProducts } from '@/lib/api';

export default async function ProductsPage({ searchParams }) {
  const category = searchParams.category || 'All';
  const products = await getProducts(category);

  return <ProductsByCategory category={category} products={products} />;
}