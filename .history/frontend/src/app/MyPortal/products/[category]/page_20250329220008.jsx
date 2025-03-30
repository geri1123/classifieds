// Final fix for app/MyPortal/products/[category]/page.jsx
import ProductsByCategory from '@/components/UserProducts/ProductsByCategory';

// Generate metadata for the page (this is App Router specific)
export async function generateMetadata({ params }) {
  return {
    title: `Products - ${params?.category || 'All'}`
  };
}

export default async function ProductsPage(context) {
  // Direct access to context with async/await pattern
  const params = context.params;
  
  // Fetch products with basic error handling
  async function fetchProducts(cat) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${cat}`, 
        {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store'
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

  // Safety check for params
  if (!params) {
    return <div>Loading...</div>;
  }
  
  // Use optional chaining and fallback
  const categoryValue = params?.category || 'All';
  
  // Fetch data using the category
  const data = await fetchProducts(categoryValue);
  
  // Return component with data
  return (
    <ProductsByCategory 
      products={data.success ? data.products : []} 
      error={data.error} 
      category={categoryValue}
    />
  );
}