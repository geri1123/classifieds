"use client";
import { useState, useEffect } from 'react';

export default function ProductsByCategory({ products = [], error, category }) {
  // We can remove the loading state since data is fetched server-side
  // and will already be available when component renders
  
  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{category} Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48 w-full">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span>No image available</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <p className="mb-1"><span className="font-medium">Category:</span> {product.category_name}</p>
                {product.subcategory_name && (
                  <p className="mb-1"><span className="font-medium">Subcategory:</span> {product.subcategory_name}</p>
                )}
                <p className="text-lg font-bold mt-2">${product.price}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            No products available for {category} category
          </div>
        )}
      </div>
    </div>
  );
}