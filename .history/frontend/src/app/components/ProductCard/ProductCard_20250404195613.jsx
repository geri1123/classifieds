// "use client"
// import { useState } from "react";
// import Image from "next/image";

// export default function ProductCard({ product }) {
//   const [isHovered, setIsHovered] = useState(false);

//   const imageUrl =
//     product.images && product.images.length > 0
//       ? product.images[0] // default image
//       : "/images/OIP.jpg";

//   const hoverImageUrl =
//     product.images && product.images.length > 1
//       ? product.images[1] // second image on hover
//       : imageUrl; // fallback to first image if no second

//   return (
//     <div
//       className="border rounded-lg overflow-hidden shadow-sm"
//       // onMouseEnter={() => setIsHovered(true)}
//       // onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="relative w-full h-48">
//         <Image
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           src={isHovered ? hoverImageUrl : imageUrl}
//           alt={product.name || "Product image"}
//           fill={true}
//           priority={true}
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           className="rounded-md object-cover transition duration-300"
//         />
//       </div>
//       <div className="p-4">
//         <h3 className="font-medium truncate">{product.title}</h3>
//         <div className="flex space-x-1 text-gray-500 text-sm">
//           <p>{product.category_name}</p>
//           <span>/</span>
//           <p>{product.subcategory_name}</p>
//           <span>/</span>
//           <p>{product.subcategory_item_name}</p>
//         </div>
//         <p className="mt-2 font-bold">{product.price}</p>
//       </div>
//       <div>
//       {product?.topAttributes && product.topAttributes.length > 0 && (
//           <ul className="mt-2 text-sm text-gray-600">
//             {product.topAttributes.map((attr, index) => (
//               <li key={index} className="flex justify-between border-t pt-1">
//                 <span className="font-medium">{attr.name}:</span>
//                 <span>{attr.value}</span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
import ProductCard from "@/components/ProductCard/ProductCard";

export default async function ProductPage() {
  let products = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const data = await response.json();
    products = Array.isArray(data) ? data : data.products || [];
    
    // Log for debugging
    console.log(`Fetched ${products.length} products`);
    if (products.length > 0) {
      console.log("First product sample:", {
        id: products[0].id,
        title: products[0].title,
        hasImages: products[0].images?.length > 0,
        hasAttributes: products[0].attributes?.length > 0
      });
    }
  } catch (error) {
    console.error("Error loading products:", error);
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-10">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}