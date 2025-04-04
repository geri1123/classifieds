// Assuming this is your ProductCard component
import Image from "next/image";

export default function ProductCard({ product }) {
  // Check if product has images and use the first one, or fallback to a placeholder
  const processedResults = results.map(product => {
    return {
      ...product,
      images: product.images
        ? product.images.split(',').map(url => `http://localhost:8081${url}`)
        : ['/images/placeholder.jpg']  // Fallback image URL
    };
  });

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="relative w-full h-48">
        <Image 
          src={imageUrl} 
          alt={product.name || "Product image"} 
          layout="fill" 
          objectFit="cover"
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