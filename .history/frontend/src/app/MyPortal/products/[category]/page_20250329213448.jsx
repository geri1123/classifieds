import ProductsByCategory from '@/components/UserProducts/ProductsByCategory';

async function fetchProducts(category) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${category}`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store', // Ensures fresh data for each request
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error.message);
    return { success: false, products: [], error: 'Failed to fetch products' };
  }
}

// ✅ Fix: Ensure correct handling of `params.category`
export default async function ProductsPage({ params }) {
  if (!params || !params.category) {
    return <div>Loading...</div>; // Prevents Next.js error when params is undefined
  }

  const category = decodeURIComponent(params.category); // ✅ Ensure proper handling of params

  // ✅ Fetch products on the server side
  const data = await fetchProducts(category);

  return <ProductsByCategory products={data.products} error={data.error} />;
}
