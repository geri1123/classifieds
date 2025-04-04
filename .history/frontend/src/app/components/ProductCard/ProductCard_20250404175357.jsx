import Image from "next/image";

export default function ProductCard({ product }) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url // or .image_url depending on your structure
      : "/images/placeholder.jpg";

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md transition duration-300"
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
