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


export default async function ProductsPage({ params }) {
 
  const category = params?.category ? decodeURIComponent(params.category) : 'All';

  const data = await fetchProducts(category);

  return <ProductsByCategory products={data.products} error={data.error} />;
}
