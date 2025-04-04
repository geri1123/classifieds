export async function fetchProducts(page, limit) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/all-products?page=${page}&limit=${limit}`,
        {
          cache: "no-store",
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return { products: [], total: 0 };
    }
  }