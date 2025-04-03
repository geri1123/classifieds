"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";

export function ProductsComponent({ fetchProductsAction }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the loadProducts function
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchProductsAction();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [fetchProductsAction]);

  if (loading) return <p className="text-center py-8">Loading products...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center py-8">No products found.</p>
      )}
      
      {/* Add a debug button during development */}
      <button 
        onClick={loadProducts}
        className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Reload Products
      </button>
    </div>
  );
}