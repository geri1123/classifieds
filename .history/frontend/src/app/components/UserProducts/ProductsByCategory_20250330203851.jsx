export default function ProductsByCategory({ products, category }) {
  return (
    <div>
      <h1 className="md:text-3xl text-2xl  my-6 font-semibold dark:text-white text-gray-900">Your {category} Products</h1> 
      {products.length === 0 ? (
        <p className="text-gray-600">No products found in this category</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg flex flex-col">
              {/* Product Images */}
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <div key={index} className="mb-2 w-full ">
                    {image.endsWith(".pdf") ? (
                      <div className="w-full h-48 bg-gray-200 flex flex-col items-center justify-center rounded-lg p-2">
                        <p className="text-sm text-gray-500">PDF File</p>
                        <a
                          href={image}
                          download
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                          Download PDF
                        </a>
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
