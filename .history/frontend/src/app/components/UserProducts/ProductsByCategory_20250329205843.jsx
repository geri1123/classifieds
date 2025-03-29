"use client";

export default function ProductsByCategory({ products = [], error }) {
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-bold">{product.title}</h3>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-gray-600">Category: {product.category_name}</p>
            <p className="text-gray-600">Subcategory: {product.subcategory_name}</p>
            <p className="text-green-600 font-bold">Price: ${product.price}</p>
            <div className="flex gap-2 mt-2">
              {product.images.map((image, index) => (
                <img className="w-20 h-20 object-cover rounded-lg" key={index} src={image} alt={`Product ${product.id}`} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No products available</div>
      )}
    </div>
  );
}