"use server";

export async function fetchProductsAction(page = 1, limit = 10) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?page=${page}&limit=${limit}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
}