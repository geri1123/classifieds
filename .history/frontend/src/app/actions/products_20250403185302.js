"use server";

export async function fetchProductsAction() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    
    // Make sure we're returning the expected structure
    return {
      products: data.products || [],
      success: data.success,
      total: data.total || 0
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], success: false, total: 0 };
  }
}