'use client';

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function PaginationControls({ page, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage);
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of page range
    let startPage = Math.max(2, page - 1);
    let endPage = Math.min(totalPages - 1, page + 1);
    
    // Adjust range if needed
    if (page <= 3) {
      endPage = Math.min(5, totalPages - 1);
    } else if (page >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 4);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div className="flex justify-center items-center mt-4 gap-2">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
        className="bg-blue-500 text-white px-3 py-2 rounded disabled:opacity-50"
      >
        Previous
      </button>
      
      {getPageNumbers().map((pageNum, index) => (
        pageNum === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2">...</span>
        ) : (
          <button
            key={`page-${pageNum}`}
            onClick={() => pageNum !== page && handlePageChange(pageNum)}
            className={`px-3 py-2 rounded ${
              pageNum === page
                ? 'bg-blue-700 text-white font-bold'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {pageNum}
          </button>
        )
      ))}
      
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
        className="bg-blue-500 text-white px-3 py-2 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}