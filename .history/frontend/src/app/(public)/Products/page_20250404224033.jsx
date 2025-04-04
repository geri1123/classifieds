import ProductCard from "@/components/ProductCard/ProductCard";

async function fetchProducts() {
  try {
    const response = await fetch(`../api/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.products || data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Re-throw the error after logging it
  }
}

export default async function ProductPage() {
  let products = [];

  try {
    products = await fetchProducts();
  } catch (error) {
    console.error("Error loading products:", error);
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}