
// "use client"
// import { ProductsComponent } from "@/components/ProductComponent/ProductComponent";
// import { fetchProductsAction } from "@/actions/products";

// export default function ProductsPage() {

 

//   return <ProductsComponent fetchProductsAction={fetchProductsAction} />;
// }
import { Suspense } from "react";
import { ProductsComponent } from "@/components/ProductComponent/ProductComponent";
import { fetchProductsAction } from "@/actions/products";
import { Metadata } from "next";

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }) {
  const category = params?.category || "All";
  const page = searchParams?.page || 1;
  
  return {
    title: `${category} Products - Page ${page} | Your Store Name`,
    description: `Browse our selection of ${category.toLowerCase()} products. Find the best deals on high-quality ${category.toLowerCase()} items.`,
    openGraph: {
      title: `${category} Products | Your Store Name`,
      description: `Browse our selection of ${category.toLowerCase()} products. Find the best deals on high-quality ${category.toLowerCase()} items.`,
      type: 'website',
      url: `/products${category !== "All" ? `/${category.toLowerCase()}` : ""}${page > 1 ? `?page=${page}` : ""}`,
    },
    alternates: {
      canonical: `/products${category !== "All" ? `/${category.toLowerCase()}` : ""}${page > 1 ? `?page=${page}` : ""}`,
    }
  };
}

// Pre-fetch products on the server for initial load
export async function getStaticProps() {
  const products = await fetchProductsAction();
  return {
    props: {
      initialProducts: products
    },
    // Revalidate every hour
    revalidate: 3600
  };
}

export default async function ProductsPage({ params, searchParams }) {
  // Fetch initial products server-side
  const initialProducts = await fetchProductsAction();
  
  return (
    <>
      <Suspense fallback={<p className="text-center py-8">Loading products...</p>}>
        <ProductsComponent 
          fetchProductsAction={fetchProductsAction} 
          initialProducts={initialProducts}
          category={params?.category || "All"}
        />
      </Suspense>
      
      {/* Add WebSite schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${params?.category || "All"} Products | Your Store Name`,
            "description": `Browse our selection of ${(params?.category || "all").toLowerCase()} products.`,
            "url": `/products${params?.category ? `/${params.category.toLowerCase()}` : ""}${searchParams?.page ? `?page=${searchParams.page}` : ""}`
          })
        }}
      />
    </>
  );
}