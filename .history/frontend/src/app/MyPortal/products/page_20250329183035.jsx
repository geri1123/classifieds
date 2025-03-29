"use client";
import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`, {
          method: "GET",
          credentials: "include", // include credentials (cookies)
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products); // Set the fetched products
        } else {
          setError("No products found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on component mount

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
                <img className="w-100 h-30" key={index} src={image} alt={`Product ${product.id}`} />
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
