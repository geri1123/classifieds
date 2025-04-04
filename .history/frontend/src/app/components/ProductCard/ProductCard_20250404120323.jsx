"use client";

import React, { useState } from "react";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);

  const hasSecondImage = product.images && product.images.length > 1;
  const firstImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/images/OIP.jpg";
  const secondImage = hasSecondImage ? product.images[1] : firstImage;

  // Filter to only show attributes that have values
  const attributesWithValues = product.attributes?.filter(attr => attr.value !== null) || [];


  return (
    <div
      className="border rounded-lg shadow-lg p-4 transition duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image */}
      <img
        src={hovered && hasSecondImage ? secondImage : firstImage}
        alt={product.title}
        className="w-full h-40 object-cover rounded-md transition duration-300"
      />

      {/* Product Details */}
      <h2 className="text-lg font-semibold mt-2 w-full truncate">{product.title}</h2>

      <div className="flex flex-wrap gap-1 text-xs text-gray-600 mb-2">
        <span>{product.category_name}</span>
        {product.subcategory_name && (
          <>
            <span>&gt;</span>
            <span>{product.subcategory_name}</span>
          </>
        )}
        {product.subcategory_item_name && (
          <>
            <span>&gt;</span>
            <span>{product.subcategory_item_name}</span>
          </>
        )}
      </div>

      <p className="text-gray-900 font-bold mb-3">
        {product.price} {product.currency}
      </p>

      {/* Product Attributes */}
      <div className="mt-4 text-sm text-gray-700">
  <strong>Specifications:</strong>
  {attributesToShow.length > 0 ? (
    <ul className="mt-1 space-y-1">
      {attributesToShow.map(attr => (
        <li key={attr.id}>
          <span className="font-semibold">{attr.name}</span>:{" "}
          {attr.value ?? <em className="text-gray-400">N/A</em>}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 italic">No specifications available</p>
  )}
</div>
    </div>
  );
}