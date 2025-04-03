"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow-lg p-4">
      <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`}>
        <div className="relative w-full h-40 mb-2">
          <Image
            src={product.product_images?.[0]?.url || "/placeholder.jpg"}
            alt={product.product_images?.[0]?.alt || `${product.name} product image`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-md"
            priority={product.featured}
          />
        </div>
        <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
        <p className="text-gray-600">{product.category_name}</p>
        <p className="text-gray-900 font-bold">${product.price}</p>
      </Link>
      
      {/* Add JSON-LD structured data for each product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.product_images?.[0]?.url || "/placeholder.jpg",
            "description": product.description || `${product.name} in ${product.category_name} category`,
            "category": product.category_name,
            "offers": {
              "@type": "Offer",
              "url": `/products/${product.id}`,
              "priceCurrency": "USD",
              "price": product.price,
              "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })
        }}
      />
    </div>
  );
}