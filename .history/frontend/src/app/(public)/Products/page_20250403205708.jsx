
"use client"
import { ProductsComponent } from "@/components/ProductComponent/ProductComponent";
import { fetchProductsAction } from "@/actions/products";

export default function ProductsPage() {

 

  return <ProductsComponent fetchProductsAction={fetchProductsAction} />;
}
