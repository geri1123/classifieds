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
      
//       {product.topAttributes && (
//           <ul className="mt-2 text-sm text-gray-600">
//             {product.topAttributes.map((attr, index) => (
//               <li key={index}>
//                 <strong>{attr.name}:</strong> {attr.value}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
"use client"
import { useState } from "react";
import Image from "next/image";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Add fallback image
  const fallbackImage = "/images/OIP.jpg";

  // Safely extract image URL with thorough validation
  const imageUrl = product?.images?.[0]?.url || fallbackImage;
  
  // Only use second image if it exists and has a valid URL
  const hoverImageUrl = product?.images?.[1]?.url || imageUrl;

  // Log image URLs for debugging
  // console.log("Product images:", product?.images);
  // console.log("Primary image:", imageUrl);
  // console.log("Hover image:", hoverImageUrl);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="relative w-full h-48">
        {/* Only render Image if we have a valid URL */}
        {imageUrl && (
          <Image
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            src={isHovered ? hoverImageUrl : imageUrl}
            alt={product?.title || "Product image"}
            fill={true}
            priority={false} // Changed from true to reduce unnecessary preloads
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-md object-cover transition duration-300"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate">{product?.title || "Untitled Product"}</h3>
        <div className="flex flex-wrap gap-1 text-gray-500 text-sm">
          {product?.category_name && <p>{product.category_name}</p>}
          
          {product?.category_name && product?.subcategory_name && <span>/</span>}
          {product?.subcategory_name && <p>{product.subcategory_name}</p>}
          
          {product?.subcategory_name && product?.subcategory_item_name && <span>/</span>}
          {product?.subcategory_item_name && <p>{product.subcategory_item_name}</p>}
        </div>
        <p className="mt-2 font-bold">
          {product?.currency || "$"} {parseFloat(product?.price || 0).toFixed(2)}
        </p>
      </div>
      <div className="px-4 pb-4">
        {product?.topAttributes && product.topAttributes.length > 0 && (
          <ul className="mt-2 text-sm text-gray-600">
            {product.topAttributes.map((attr, index) => (
              <li key={index} className="flex justify-between border-t pt-1">
                <span className="font-medium">{attr.name}:</span> 
                <span>{attr.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}