"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from "@/components/ProductCard/ProductCard";

export function ProductsComponent({ fetchProductsAction }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Extract filter values from URL
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const subcategoryItems = searchParams.get('subcategory_items') || '';
  
  // Extract attribute filters
  const attributeFilters = {};
  searchParams.forEach((value, key) => {
    if (!['page', 'limit', 'category', 'subcategory', 'subcategory_items'].includes(key)) {
      attributeFilters[key] = value;
    }
  });
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  // Use useCallback to memoize the loadProducts function
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching products with filters...");
      
      const filters = {
        page,
        limit,
        category: category || undefined,
        subcategory: subcategory || undefined,
        subcategory_items: subcategoryItems || undefined,
        attributes: Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined
      };
      
      const productsData = await fetchProductsAction(filters);
      console.log("Products received:", productsData);
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [fetchProductsAction, page, limit, category, subcategory, subcategoryItems, attributeFilters]);

  // Apply filters function
  const applyFilters = (newFilters) => {
    const params = new URLSearchParams();
    
    // Add basic filters
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.subcategory) params.set('subcategory', newFilters.subcategory);
    if (newFilters.subcategory_items) params.set('subcategory_items', newFilters.subcategory_items);
    
    // Reset page when filters change
    params.set('page', '1');
    
    // Add attribute filters
    if (newFilters.attributes) {
      Object.entries(newFilters.attributes).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }
    
    // Update URL with new filters
    router.push(`/products?${params.toString()}`);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) return <p className="text-center py-8">Loading products...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter sidebar */}
        <div className="w-full md:w-1/4">
         
        </div>
        
        {/* Products grid */}
        <div className="w-full md:w-3/4">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center py-8">No products found matching your filters.</p>
          )}
          
          {/* Pagination controls */}
          <div className="mt-8 flex justify-center">
            <button 
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page}</span>
            <button 
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 ml-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}