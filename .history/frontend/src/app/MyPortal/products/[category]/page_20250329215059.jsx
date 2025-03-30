import ProductsByCategory from '@/components/UserProducts/ProductsByCategory';

async function fetchProducts(category) {
  try {
    // Ensure category is properly encoded for the URL
    const encodedCategory = encodeURIComponent(category);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${encodedCategory}`, 
      {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store', // Ensures fresh data for each request
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
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
  if (!params || !params.category) {
    return <div>Loading...</div>;
  }
  
  const category = decodeURIComponent(params.category);
  const { success, products, error } = await fetchProducts(category);
  
  // Pass all data to the component
  return <ProductsByCategory 
    products={success ? products : []} 
    error={error} 
    category={category}
  />;
}