import Image from "next/image";

export default function ProductCard({ product }) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0] // or product.images[0].url if stored like that
      : '/images/OIP.jpg';

  console.log("Image URL:", imageUrl);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="relative w-full h-48">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.name || "Product image"}
            fill={true}
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-md object-cover transition duration-300"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
     <div>
        <p className="text-gray-500">{product.category_name}</p>
        <p className="text-gray-500">{product.subcaegpry_name}</p>
        </div>
        <p className="mt-2 font-bold">${product.price}</p>
      </div>
    </div>
  );
}
