export default function ProductsByCategory({ products, error }) {
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