export default function ProductsByCategory({products , category}){
  return(
   <div>
<h1>Your {category} Products</h1>
{products.length === 0 ? (
  <p>No products found in this category</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {products.map((product) => (
      <div key={product.id} className="border p-4 rounded-lg">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="w-full h-48 object-cover mb-2"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-2">
            No Image
          </div>
        )}
        <h2 className="text-lg font-bold">{product.title}</h2>
        <p className="text-gray-600">{product.category_name} / {product.subcategory_name}</p>
        <p className="font-semibold mt-2">{product.price} {product.currency}</p>
      </div>
    ))}
  </div>
)}
</div>
  )
}