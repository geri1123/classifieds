"use client";

import React from "react";

export default function ProductCard({ product }) {
  

  return (
    <div className="border rounded-lg shadow-lg p-4">
      {/* Product Image */}
      <img
        src={product.product_images && product.product_images.length > 0 ? product.product_images : "/placeholder.jpg"}
        alt={product.product_images && product.product_images.length > 0 ? product.product_images : "Placeholder image"}
        className="w-full h-40 object-cover rounded-md"
      />
      {/* Product Details */}
      <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
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
        {product.attributes && product.attributes.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {product.attributes.map((attr, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{attr.attribute_name}:</span>
                <span className="font-medium">{formatAttributeValue(attr)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No specifications available</p>
        )}
      </div>
    </div>
  );
}