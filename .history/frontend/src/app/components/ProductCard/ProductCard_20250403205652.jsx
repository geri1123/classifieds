"use client";

import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow-lg p-4">
      <img
        src={product.product_images?.[0]?.url || "/placeholder.jpg"}
        alt={product.product_images?.[0]?.alt || "Product image"}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-600">{product.category_name}</p>
      <p className="text-gray-900 font-bold">${product.price}</p>
    </div>
  );
}
