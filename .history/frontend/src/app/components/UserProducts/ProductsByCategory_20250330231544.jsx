import { HiDotsHorizontal } from 'react-icons/hi';
import useDropdownId from '@/hooks/dropdowns/useDropdownId';
import UpdateStatusType from '@/components/UserProducts/UpdateStatusType';
export default function ProductsByCategory({ products, category }) {
  const { openDropdownId, setOpenDropdownId, toggleDropdown, dropdownRef, buttonRef } = useDropdownId();

  // Manual close function - use this instead of toggle when you want to ensure closing
  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  return (
    <div>
      <h1 className="md:text-3xl text-2xl my-6 font-semibold dark:text-white text-gray-900">
        Your {category} Products
      </h1>
      {products.length === 0 ? (
        <p className="text-gray-600">No products found in this category</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border-2 relative border-yellow-40 bg-white p-4 rounded-lg flex flex-col relative">
            <div
    className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full
      ${product.status_type === "published" ? "bg-green-500 text-white" : "bg-yellow-400 text-black"}`}
  >
    {product.status_type.toUpperCase()}
  </div>
              {/* Product Images */}
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <div key={index} className="mb-2 w-full">
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
                <img src="/images/OIP.jpg" alt="noimg" className="w-full h-48 object-cover rounded-lg" />
              )}
              
              {/* Product Details */}
              <h2 className="text-lg font-bold mt-2">{product.title}</h2>
              <p className="text-gray-600">{product.category_name} / {product.subcategory_name}</p>
              <p className="font-semibold mt-2">{product.price} {product.currency}</p>
              
              {/* 3 Dots Menu Button */}
              <div className='relative w-full flex items-center gap-2 justify-end'>
              {/* {product.status_type === "published" ? (
  <button className="border-2 px-2 py-1 rounded border-yellow-400 
                     hover:bg-yellow-400 
                     transition ease-in-out duration-300">
    Deactivate
  </button>
) : (
  <button className="border-2 px-2 py-1 rounded border-yellow-400 
                     hover:bg-yellow-400 
                     transition ease-in-out duration-300">
    Publish
  </button>
)} */}
<UpdateStatusType product={product}/>
                <div className="relative">
                  <div ref={(openDropdownId === product.id) ? buttonRef : null}>
                    <HiDotsHorizontal
                      onClick={() => {
                        if (openDropdownId === product.id) {
                          closeDropdown();
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
                      <button className="block w-full text-black px-4 py-2 hover:bg-gray-400">
                        Delete
                      </button>
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
      )}
    </div>
  );
}