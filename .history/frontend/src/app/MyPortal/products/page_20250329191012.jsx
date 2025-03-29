// src/app/MyPortal/products/page.jsx

"use client";  // <-- Add this line at the top to mark it as a client component

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';  // Using the new API from next/navigation

export default function ProductsByCategory({ products, error }) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");  // Get status from URL query params

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-list">
      {products? (
        products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>Category: {product.category_name}</p>
            <p>Subcategory: {product.subcategory_name}</p>
            <p>Price: {product.price}</p>
            <div className="images">
              {product.images.map((image, index) => (
                <img className="w-30 h-30" key={index} src={image} alt={`Product ${product.id}`} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>No products available</div>
      )}
    </div>
  );
}

// Server-side fetching in the App Directory (Directly in the component, not using getServerSideProps)
export async function fetchProducts(status) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${status}`);
  const data = await response.json();

  if (!data.success) {
    return { error: 'Failed to fetch products' };
  }

  return {
    products: data.products || [],
  };
}

// Fetch data in the Server Component
export async function ProductsPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");  // Get status from the URL query parameters

  const { products, error } = await fetchProducts(status);  // Fetch products from backend

  return <ProductsByCategory products={products} error={error} />;
}
