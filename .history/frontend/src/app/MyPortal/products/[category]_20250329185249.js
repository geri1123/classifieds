import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ProductsByCategory() {
  const router = useRouter();
  const { category } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${category}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          setError('No products found');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>Category: {product.category_name}</p>
            <p>Subcategory: {product.subcategory_name}</p>
            <p>Price: {product.price}</p>
            <div className="images">
              {product.images.map((image, index) => (
                <img className="w-30 h-30" key={index} src={image} alt={`Product ${product.id}`} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>No products available</div>
      )}
    </div>
  );
}