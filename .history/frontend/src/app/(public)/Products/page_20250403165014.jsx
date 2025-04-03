import React from 'react';

async function fetchProducts() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);
      const products = await res.json();
      console.log('Fetched products:', products);  // Log the products to see if they are returned
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; // Return empty array in case of an error
    }
  }
// The Products page component
export default async function Products() {
  const products = await fetchProducts(); // Fetch data server-side

  return (
    <div>
      <h1>Products Page</h1>
      {products.length > 0 ? (
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <h2>{product.name}</h2>
              <p>Category: {product.category_name}</p>
              <p>Subcategory: {product.subcategory_name}</p>
              <p>Subcategory Item: {product.subcategory_item_name}</p>
              <div>
                {product.product_images.map(image => (
                  <img key={image.id} src={image.url} alt={image.alt} width={100} />
                ))}
              </div>
              <div>
                <h3>Attributes:</h3>
                <ul>
                  {product.attributes.map(attr => (
                    <li key={attr.id}>
                      {attr.attribute_name}: {attr.value}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
