"use server";

export async function fetchProductsAction() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    // Return the products array, not the entire data object
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}