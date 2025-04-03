
"use client"

import { useSearchParams } from 'next/navigation';
import { ProductsComponent } from "@/components/ProductComponent/ProductComponent";
import { fetchProductsAction } from "@/actions/products";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <ProductsComponent 
        fetchProductsAction={fetchProductsAction} 
      />
    </div>
  );
}