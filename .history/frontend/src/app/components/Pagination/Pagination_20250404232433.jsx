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
  
  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="self-center">
        Page {page} of {totalPages || 1}
      </span>
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}