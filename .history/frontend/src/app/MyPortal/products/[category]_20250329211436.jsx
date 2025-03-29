import ProductsByCategory from '@/components/UserProducts/ProductsByCategory';
async function fetchProducts(category) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${category}`, {
      method: 'GET',
      credentials: 'include', // Ensures authentication cookies are sent if needed
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

export default async function ProductsPage({ searchParams, params }) {
  // Get the category from the query parameters
  const category = searchParams.category || 'All'; // Default to 'All' if no category is passed

  const data = await fetchProducts(category); // Fetch products based on the category

  return <ProductsByCategory products={data.products} error={data.error} />;
}