// "use server";

// export async function fetchProductsAction() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);
//     if (!res.ok) {
//       throw new Error(`API error: ${res.status}`);
//     }
//     const data = await res.json();
//     // Return the products array, not the entire data object
//     return data.products || [];
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return [];
//   }
// }

"use server";

export async function fetchProductsAction(category = null, page = 1, limit = 12) {
  try {
    let url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`;
    
    // Add query parameters if needed
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    
    // Append parameters to URL if any exist
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
