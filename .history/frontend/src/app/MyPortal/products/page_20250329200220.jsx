// "use client";  // Mark it as a client component

// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';  // Using the new API from next/navigation

// export default function ProductsByCategory() {
//   const searchParams = useSearchParams();
//   const status = searchParams.get("status");  // Get status from URL query params

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!status) return;

//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${status}`, {
//           method: 'GET',
//           credentials: 'include',
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch products');
//         }

//         const data = await response.json();

//         if (data.success) {
//           setProducts(data.products);
//         } else {
//           setError('No products found');
//         }
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [status]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="product-list">
//       {products.length > 0 ? (
//         products.map((product) => (
//           <div key={product.id} className="product-card">
//             <h3>{product.title}</h3>
//             <p>{product.description}</p>
//             <p>Category: {product.category_name}</p>
//             <p>Subcategory: {product.subcategory_name}</p>
//             <p>Price: {product.price}</p>
//             <div className="images">
//               {product.images.map((image, index) => (
//                 <img className="w-30 h-30" key={index} src={image} alt={`Product ${product.id}`} />
//               ))}
//             </div>
//           </div>
//         ))
//       ) : (
//         <div>No products available</div>
//       )}
//     </div>
//   );
// }
export default async function ProductsPage({ searchParams }) {
  const status = searchParams?.status || "All";

  const response = await fetch(`api/proxy?category=${status}`, {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  const data = await response.json();

  return <ProductsByCategory products={data.products} error={!data.success ? "Failed to fetch products" : null} />;
}