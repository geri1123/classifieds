import ProductCard from "@/components/ProductCard/ProductCard";

export async function getServerSideProps() {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`;
  let products = [];

  try {
    console.log("Fetching from URL:", apiUrl);
    const response = await fetch(apiUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    products = data.products || data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return {
    props: {
      products,
    },
  };
}

export default function ProductPage({ products }) {
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