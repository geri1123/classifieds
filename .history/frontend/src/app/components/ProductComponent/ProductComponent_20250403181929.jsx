"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';
i
export function ProductsComponent({ fetchProductsAction }) {
  // State management
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  
  // Data fetching with useEffect - calling the server action
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      // Call the server action
      const data = await fetchProductsAction(page, limit);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setLoading(false);
    }
    loadProducts();
  }, [page, fetchProductsAction]);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const totalPages = Math.ceil(total / limit);
  
  // UI rendering
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Products Page</h1>
      
      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">No products found.</div>
      )}
      
      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex justify-between items-center mt-8">
          <button 
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          
          <span>Page {page} of {totalPages}</span>
          
          <button 
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}