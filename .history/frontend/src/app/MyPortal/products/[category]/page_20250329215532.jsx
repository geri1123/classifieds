// Simplified approach for app/MyPortal/products/[category]/page.jsx
import ProductsByCategory from '@/components/UserProducts/ProductsByCategory';

export default async function ProductsPage({ params }) {
  // Fetch products function
  async function fetchProducts(categoryParam) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${encodeURIComponent(categoryParam)}`, 
        {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
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

  // Check if we have params
  if (!params) {
    return <div>Loading...</div>;
  }
  
  try {
    // Get category from segment
    const categorySegment = params.category || 'All';
    const category = decodeURIComponent(categorySegment);
    
    // Fetch data
    const data = await fetchProducts(category);
    
    // Return component
    return (
      <ProductsByCategory 
        products={data.success ? data.products : []} 
        error={data.error} 
        category={category}
      />
    );
  } catch (error) {
    console.error("Error in page:", error);
    return <div>Error loading products: {error.message}</div>;
  }
}