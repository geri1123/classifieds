export default function ProductsByCategory({ products, category }) {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Your {category} Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-600">No products found in this category</p>
      ) : (
        <div className="flex flex-col gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg flex flex-col">
              {/* Product Images */}
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <div key={index} className="mb-2 w-full">
                    {image.endsWith(".pdf") ? (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <embed src={image} type="application/pdf" className="w-full h-48" />
                        <p className="text-sm text-gray-500">PDF File</p>
                      </div>
                    ) : (
                      <img src={image} alt={product.title} className="w-full h-48 object-cover rounded-lg" />
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                  No Image
                </div>
              )}

              {/* Product Details */}
              <h2 className="text-lg font-bold mt-2">{product.title}</h2>
              <p className="text-gray-600">{product.category_name} / {product.subcategory_name}</p>
              <p className="font-semibold mt-2">{product.price} {product.currency}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
