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
"use client"
import { useState, memo } from "react";
import Image from "next/image";

const ProductCard = memo(function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle the case where product.images might be undefined or the object structure is incorrect
  const defaultImage = "/images/OIP.jpg";
  
  // Safely extract image URLs
  let mainImageUrl = defaultImage;
  let secondImageUrl = defaultImage;
  
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    if (product.images[0] && typeof product.images[0].url === 'string') {
      mainImageUrl = product.images[0].url;
    } else if (typeof product.images[0] === 'string') {
      // In case images are stored as direct URLs
      mainImageUrl = product.images[0];
    }
    
    if (product.images.length > 1) {
      if (product.images[1] && typeof product.images[1].url === 'string') {
        secondImageUrl = product.images[1].url;
      } else if (typeof product.images[1] === 'string') {
        secondImageUrl = product.images[1];
      }
    } else {
      secondImageUrl = mainImageUrl;
    }
  }
  
  // Validate URLs to ensure they're strings and in a format Next.js can handle
  const validateUrl = (url) => {
    if (typeof url !== 'string') return defaultImage;
    if (url.startsWith('/')) return url; // Local image
    if (url.startsWith('http://') || url.startsWith('https://')) return url; // Remote image
    return defaultImage; // Invalid format, use default
  };
  
  const imageUrl = validateUrl(mainImageUrl);
  const hoverImageUrl = validateUrl(secondImageUrl);
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div 
        className="relative w-full h-48"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Use a regular img tag for better compatibility */}
        <img
          src={isHovered ? hoverImageUrl : imageUrl}
          alt={product.title || "Product image"}
          className="w-full h-full object-cover rounded-md transition duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium truncate">{product.title}</h3>
        <div className="flex space-x-1 text-gray-500 text-sm">
          <p>{product.category_name || 'Unknown Category'}</p>
          {product.subcategory_name && (
            <>
              <span>/</span>
              <p>{product.subcategory_name}</p>
            </>
          )}
          {product.subcategory_item_name && (
            <>
              <span>/</span>
              <p>{product.subcategory_item_name}</p>
            </>
          )}
        </div>
        <p className="mt-2 font-bold">{product.price} {product.currency}</p>
      </div>
      
      <div className="px-4 pb-4">
        {product?.topAttributes && product.topAttributes.length > 0 && (
          <ul className="mt-2 text-sm text-gray-600">
            {product.topAttributes.map((attr, index) => (
              <li key={index} className="flex justify-between border-t pt-1">
                <span className="font-medium">{attr.name}:</span>
                <span>{attr.value || 'N/A'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

export default ProductCard;