import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ product }) => {
  // Extract product details
  const {
    id,
    title,
    price,
    currency,
    city,
    category_name,
    subcategory_name,
    images,
    attributesObject
  } = product;

  // Get the first image or use a placeholder
  const featuredImage = images && images.length > 0 
    ? images[0].url 
    : '/placeholder-image.jpg';

  // Format price with currency
  const currencyMap = {
    Euro: 'EUR',
    Dollar: 'USD',
    Pound: 'GBP',
    Lek: 'Lek',
    // Add more mappings as needed
  };
  
  // Get currency code or fallback to 'EUR'
  const currencyCode = currencyMap[currency] || 'EUR';
  
  // Format price with symbol only
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
    currencyDisplay: 'symbol'
  }).format(price);

  return (
    <Link href={`/product/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          {featuredImage && (
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
          
          {/* Price */}
          <div className="text-xl font-bold text-blue-600 mb-2">
            {formattedPrice} {currency}
          </div>
          
          {/* Category & Location */}
          <div className="text-sm text-gray-600 mb-2">
            {category_name}{subcategory_name ? ` › ${subcategory_name}` : ''}
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            {city}{country}
          </div>
          
       
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;