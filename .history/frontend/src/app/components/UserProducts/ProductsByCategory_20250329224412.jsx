const ProductsByCategory = ({ products, error, category }) => {
    return (
      <div>
        <h1>Category: {category}</h1>
        {error && <p>Error: {error}</p>}
        <ul>
          {products.map(product => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ProductsByCategory;