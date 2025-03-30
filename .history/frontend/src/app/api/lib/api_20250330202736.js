export async function getProducts(category) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${category}`,
        {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        }
      );
  
      if (!res.ok) {
        throw new Error(`HTTP Error! Status: ${res.status}`);
      }
  
      const data = await res.json();
      return data.success ? data.products : [];
    } catch (err) {
      console.error('Fetch error:', err.message);
      return [];
    }
  }
  
