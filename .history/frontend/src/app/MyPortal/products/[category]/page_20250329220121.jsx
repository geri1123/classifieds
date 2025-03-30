// app/MyPortal/products/[category]/page.jsx
import ProductsByCategory from '@/components/UserProducts/ProductsByCategory';

// This ensures we handle any promise-like behavior of params
export default async function ProductsPage(props) {
  // Use a try/catch for safety
  try {
    // Make sure we await the params property if it's a promise
    const resolvedParams = await Promise.resolve(props.params);
    const categoryValue = resolvedParams?.category || 'All';
    
    // Fetch the products data
    const data = await fetchProducts(categoryValue);
    
    // Return the component with the data
    return (
      <ProductsByCategory 
        products={data?.success ? data.products : []} 
        error={data?.error} 
        category={categoryValue}
      />
    );
  } catch (error) {
    console.error("Error in page component:", error);
    return <div>Error loading products</div>;
  }
}

// Separate async function for fetching
async function fetchProducts(category) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${category}`, 
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