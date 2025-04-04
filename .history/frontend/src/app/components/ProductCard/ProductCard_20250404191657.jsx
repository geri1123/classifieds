"use client"
import { useState } from "react";
import Image from "next/image";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0] // default image
      : "/images/OIP.jpg";

  const hoverImageUrl =
    product.images && product.images.length > 1
      ? product.images[1] // second image on hover
      : imageUrl; // fallback to first image if no second

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-sm"
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-48">
        <Image
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          src={isHovered ? hoverImageUrl : imageUrl}
          alt={product.name || "Product image"}
          fill={true}
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-md object-cover transition duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate">{product.title}</h3>
        <div className="flex space-x-1 text-gray-500 text-sm">
          <p>{product.category_name}</p>
          <span>/</span>
          <p>{product.subcategory_name}</p>
          <span>/</span>
          <p>{product.subcategory_item_name}</p>
        </div>
        <p className="mt-2 font-bold">{product.price}</p>
      </div>
      <div>
      
      {product.topAttributes && (
          <ul className="mt-2 text-sm text-gray-600">
            {product.topAttributes.map((attr, index) => (
              <li key={index}>
                <strong>{attr.name}:</strong> {attr.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
