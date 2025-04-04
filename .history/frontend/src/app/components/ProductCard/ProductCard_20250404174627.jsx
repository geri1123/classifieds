// Assuming this is your ProductCard component
import Image from "next/image";

export default function ProductCard({ product }) {
  // Check if product has images and use the first one, or fallback to a placeholder
  console.log(product.images)
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="relative w-full h-48">
      <img 
  src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'}
  alt={product.title}
  className="w-full h-40 object-cover rounded-md transition duration-300"
/>
      </div>
      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-gray-500">{product.category_name}</p>
        <p className="mt-2 font-bold">${product.price}</p>
      </div>
    </div>
  );
}