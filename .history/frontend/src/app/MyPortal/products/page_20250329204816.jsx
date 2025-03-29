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
"use client";

export default function ProductsByCategory({ products, error }) {
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-bold">{product.title}</h3>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-gray-600">Category: {product.category_name}</p>
            <p className="text-gray-600">Subcategory: {product.subcategory_name}</p>
            <p className="text-green-600 font-bold">Price: ${product.price}</p>
            <div className="flex gap-2 mt-2">
              {product.images.map((image, index) => (
                <img className="w-20 h-20 object-cover rounded-lg" key={index} src={image} alt={`Product ${product.id}`} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No products available</div>
      )}
    </div>
  );
}

async function fetchProducts(category) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${category}`, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error.message);
    return { success: false, products: [], error: 'Failed to fetch products' };
  }
}

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category || 'All';
  const data = await fetchProducts(category);

  return <ProductsByCategory products={data.products} error={data.error} />;
}