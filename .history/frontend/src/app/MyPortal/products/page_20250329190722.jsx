
import { useRouter } from 'next/router';

export default function ProductsByCategory({ products, error }) {
  const router = useRouter();
  const { status } = router.query;  // Use query params from URL

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

// Server-side rendering: Fetch data from Express backend
export async function getServerSideProps(context) {
  const { status } = context.query;  // Get the status query param from the URL
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${status}`);
  const data = await response.json();

  if (!data.success) {
    return { props: { error: 'Failed to fetch products' } };
  }

  return {
    props: {
      products: data.products || [],
    },
  };
}
