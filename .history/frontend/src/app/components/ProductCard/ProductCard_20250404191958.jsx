"use client"
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasAttributes, setHasAttributes] = useState(false);

  // Check if product attributes exist and log them
  useEffect(() => {
    // Check if attributes exist
    if (product?.attributes && product.attributes.length > 0) {
      setHasAttributes(true);
      console.log("Product ID:", product.id, "has attributes:", product.attributes);
      console.log("attributesObject:", product.attributesObject);
    } else {
      console.log("Product ID:", product.id, "has NO attributes");
    }
  }, [product]);

  const imageUrl =
    product.image && product.image.length > 0
      ? product.image[0].url // Make sure to access the url property
      : "/images/OIP.jpg";

  const hoverImageUrl =
    product.images && product.images.length > 1
      ? product.images[1].url // Make sure to access the url property
      : imageUrl;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="relative w-full h-48">
        <Image
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          src={isHovered ? hoverImageUrl : imageUrl}
          alt={product.title || "Product image"}
          fill={true}
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-md object-cover transition duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate">{product.title}</h3>
        <div className="flex space-x-1 text-gray-500 text-sm">
          {product.category_name && <p>{product.category_name}</p>}
          {product.category_name && product.subcategory_name && <span>/</span>}
          {product.subcategory_name && <p>{product.subcategory_name}</p>}
          {product.subcategory_name && product.subcategory_item_name && <span>/</span>}
          {product.subcategory_item_name && <p>{product.subcategory_item_name}</p>}
        </div>
        <p className="mt-2 font-bold">{product.price}</p>
      </div>
      
      {/* Debug information for attributes */}
      <div className="px-4 pb-2">
        <p className="text-xs text-gray-500">
          Attributes available: {hasAttributes ? "Yes" : "No"}
        </p>
      </div>
      
      <div className="px-4 pb-4">
        {product?.topAttributes && product.topAttributes.length > 0 ? (
          <ul className="mt-2 text-sm text-gray-600">
            {product.topAttributes.map((attr, index) => (
              <li key={index} className="flex justify-between border-t pt-1">
                <span className="font-medium">{attr.name}:</span> 
                <span>{attr.value}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-orange-500">No attributes to display</p>
        )}
      </div>
    </div>
  );
}