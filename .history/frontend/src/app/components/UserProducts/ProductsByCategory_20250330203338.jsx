export default function ProductsByCategory({ products, category }) {
  return (
    <div>
      <h1>Your {category} Products</h1>
      {products.length === 0 ? (
        <p>No products found in this category</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg">
              {/* Check if product has images */}
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <div key={index} className="mb-2">
                    {/* If it's a PDF, embed it */}
                    {image.endsWith(".pdf") ? (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <embed
                          src={image}
                          type="application/pdf"
                          className="w-full h-48"
                        />
                        <p className="text-sm text-gray-500">PDF File</p>
                      </div>
                    ) : (
                      // If it's an image, display it
                      <img
                        src={image}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  No Image
                </div>
              )}

              {/* Product Details */}
              <h2 className="text-lg font-bold">{product.title}</h2>
              <p className="text-gray-600">{product.category_name} / {product.subcategory_name}</p>
              <p className="font-semibold mt-2">{product.price} {product.currency}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
