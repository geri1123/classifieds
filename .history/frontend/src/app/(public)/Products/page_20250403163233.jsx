import React from 'react';

// Server-side fetching function
export async function getServerSideProps() {
  try {
    // Fetch products from your Express.js API
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`); // Make sure this is the correct API URL
    const products = await res.json();

    // If no products are found, you could handle this case
    if (!products || products.length === 0) {
      return { props: { products: [] } };
    }

    // Return the products as props
    return { props: { products } };

  } catch (error) {
    console.error('Error fetching products:', error);
    return { props: { products: [] } }; // Return empty array in case of an error
  }
}

// The Products page component
export default function Products({ products }) {
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
