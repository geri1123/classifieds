"use client";
import { useRouter } from "next/router";

export default function Pagination({ page, totalPages }) {
  const router = useRouter();

  const handlePageChange = (newPage) => {
    router.push(`/products?page=${newPage}`);
  };

  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="self-center">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}