
import { useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import useDropdownId from '@/hooks/dropdowns/useDropdownId';
import UpdateStatusType from '@/components/UserProducts/UpdateStatusType';
import { BsBuildingGear } from "react-icons/bs";
import Button from '@/components/ui/Button';
import DeleteProduct from '@/components/UserProducts/DeleteProduct';

export default function ProductsByCategory({ products: initialProducts, category }) {
  const [products, setProducts] = useState(initialProducts);
  const [visibleCount, setVisibleCount] = useState(6); // Initial count of products to display
  const [loadingMore, setLoadingMore] = useState(false); // State to manage button loading
  const { openDropdownId, setOpenDropdownId, toggleDropdown, dropdownRef, buttonRef } = useDropdownId();

  const handleStatusUpdated = (productId, newStatus) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, status_type: newStatus }
          : product
      )
    );
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setLoadingMore(false);
    }, 1000); // Delay by 1 second
  };

  return (
    <div className='lg:p-6'>
      <h1 className="md:text-3xl flex gap-3 items-center text-2xl my-6 font-semibold dark:text-white text-gray-900">
        <BsBuildingGear size={25} /> Your {category} Products
      </h1>

      {products.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64">
           <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-16 w-16 text-gray-400 mb-3"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth={2}
           >
               <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-4 4h.01M4 12h16M4 6h16" />
           </svg>
           <p className="text-gray-600 text-lg font-semibold">No products found in this category</p>
           <p className="text-gray-500 text-sm">Try selecting a different category or check back later.</p>
       </div>
        // <p className="text-gray-600">No products found in this category</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {products.slice(0, visibleCount).map((product) => (
              <div key={product.id} className="border-2 relative border-yellow-40 bg-white p-4 rounded-lg flex flex-col">
                <div
                  className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full
                    ${product.status_type === "published" ? "bg-green-500 text-white" : "bg-yellow-400 text-black"}`}
                >
                  {product.status_type.toUpperCase()}
                </div>

                {/* Product Images */}
                {product.images && product.images.length > 0 ? (
    <div className="mb-2 w-full">
      {product.images[0].endsWith(".pdf") ? (
        <div className="w-full h-48 bg-gray-200 flex flex-col items-center justify-center rounded-lg p-2">
          <p className="text-sm text-gray-500">PDF File</p>
          <a
            href={product.images[0]}
            download
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Download PDF
          </a>
        </div>
      ) : (
        <img
          src={product.images[0]}  // Show only the first image
          alt={product.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}
    </div>
  ) : (
    <img src="/images/OIP.jpg" alt="noimg" className="w-full h-48 rounded-lg" />
  )}
                {/* Product Details */}
                <h2 className="text-lg font-bold mt-2">{product.title}</h2>
                <p className="text-gray-600">{product.category_name} / {product.subcategory_name}</p>
                <p className="font-semibold mt-2">{product.price} {product.currency}</p>

                {/* Dropdown Menu */}
                <div className='relative w-full flex items-center mt-2 gap-2 justify-end'>
                  <UpdateStatusType 
                    product={product} 
                    onStatusUpdated={handleStatusUpdated} 
                  />
                  <div className="relative">
                    <div ref={(openDropdownId === product.id) ? buttonRef : null}>
                      <HiDotsHorizontal
                        onClick={() => {
                          if (openDropdownId === product.id) {
                            setOpenDropdownId(null);
                          } else {
                            setOpenDropdownId(product.id);
                          }
                        }}
                        className="hover:bg-yellow-40 hover:text-black duration-300 ease-in-out transition-all text-[20px] border-yellow-400 text-black dark:text-blue-200 dark:hover:bg-blue-200 dark:hover:text-black cursor-pointer border-1 dark:border-blue-200 rounded w-8 h-7 flex items-center justify-center"
                      />
                    </div>

                    {/* Dropdown */}
                    {openDropdownId === product.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute bg-gray-100 border-gray-800 shadow-lg border-1 transform transition-all duration-100 ease-in-out animate-fadeInOut bottom-8 right-0 dark:bg-white shadow-light w-32 z-10"
                      >
                      
                        <DeleteProduct 
                         productId={product.id} 
                         onProductDeleted={(deletedId) => {
                           setProducts(prevProducts => prevProducts.filter(p => p.id !== deletedId));
                         }} 
                        />
                        <button className="block w-full text-black px-4 py-2 hover:bg-gray-400">
                          View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < products.length && (
            <div className="flex justify-center mt-6">
              <div>
              <Button onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load More"}
              </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
