"use server";

export async function fetchProductsAction(filters = {}) {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    // Add pagination
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    // Add category filters
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.subcategory) queryParams.append('subcategory', filters.subcategory);
    if (filters.subcategory_items) queryParams.append('subcategory_items', filters.subcategory_items);
    
    // Add attribute filters
    if (filters.attributes && typeof filters.attributes === 'object') {
      Object.entries(filters.attributes).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
    }
    
    const queryString = queryParams.toString();
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url);
    
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