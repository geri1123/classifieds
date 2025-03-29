// pages/MyPortal/products/[category].jsx
import { useRouter } from 'next/router';
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

export default function ProductsPage() {
  const router = useRouter();
  const { category } = router.query;  // This retrieves the dynamic category from the URL

  const [products, setProducts] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (category) {
      fetchProducts(category).then(data => {
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.error);
        }
      });
    }
  }, [category]);

  return <ProductsByCategory products={products} error={error} />;
}
