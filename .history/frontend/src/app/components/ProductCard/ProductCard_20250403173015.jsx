import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <li>
      <h2>{product.title}</h2>
      <p>Category: {product.category_name}</p>
      <p>Subcategory: {product.subcategory_name}</p>
      <p>Subcategory Item: {product.subcategory_item_name}</p>
      <div>
        {product.images.map((image, index) => (
          <img key={index} src={image} alt={product.title} width={100} />
        ))}
      </div>
      <div>
        <h3>Price: {product.currency} {product.price}</h3>
        <p>{product.description}</p>
      </div>
      <div>
        <h3>Seller:</h3>
        <p>{product.seller_username}</p>
      </div>
    </li>
  );
};

export default ProductCard;