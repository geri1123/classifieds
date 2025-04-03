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
      <div className="mt-3 pt-3 border-t border-gray-200">
        <h3 className="text-sm font-semibold mb-2">Specifications:</h3>
        {/* Add more attributes here later */}
      </div>
    </div>
  );
}
