"use client";
import React, { useState } from "react";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  
  const hasSecondImage = product.images && product.images.length > 1;
  const firstImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : "/images/OIP.jpg";
  const secondImage = hasSecondImage ? product.images[1] : firstImage;
  
  // Improved attribute parsing function
  const parseAttributes = (attributesStr) => {
    if (!attributesStr) return [];
    
    // Debug - log the raw attributes string
    console.log("Raw attributes:", attributesStr);
    
    // Handle attribute parsing more carefully
    try {
      return attributesStr.split(', ').map(attr => {
        const separatorIndex = attr.indexOf(':');
        if (separatorIndex === -1) return { name: attr, value: '' };
        
        const name = attr.substring(0, separatorIndex);
        const value = attr.substring(separatorIndex + 1);
        return { name, value };
      }).filter(attr => attr.name); // Filter out any empty attribute names
    } catch (err) {
      console.error("Error parsing attributes:", err);
      return [];
    }
  };
  
  // Parse attributes with the improved function
  const attributes = parseAttributes(product.attributes);
  
  // Debug - log the parsed attributes
  console.log("Parsed attributes:", attributes);

  return (
    <div 
      className="border rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image */}
      <img 
        src={hovered && hasSecondImage ? secondImage : firstImage}
        alt={product.title || "Product"}
        className="w-full h-40 object-cover rounded-md transition duration-300"
      />
      
      {/* Product Details */}
      <h2 className="text-lg font-semibold mt-2 w-full truncate">{product.title || "Unnamed Product"}</h2>
      
      <div className="flex flex-wrap gap-1 text-xs text-gray-600 mb-2">
        <span>{product.category_name || "Uncategorized"}</span>
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
        {product.price || "N/A"} {product.currency || ""}
      </p>
      
      {/* Product Attributes - Debug View */}
      <div className="mt-4 text-sm text-gray-700">
        <strong>Raw Attributes:</strong>
        <p className="text-xs text-gray-500 mt-1 mb-2 italic">
          {product.attributes || "No attributes data available"}
        </p>
        
        <strong>Specifications:</strong>
        {attributes && attributes.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {attributes.map((attr, index) => (
              <li key={index} className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-600">{attr.name || "Unknown"}:</span>
                <span className="font-medium">{attr.value || "N/A"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-gray-500 italic">No specifications available</p>
        )}
      </div>
    </div>
  );
}