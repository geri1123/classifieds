export async function GET(req) {
    console.log("Fetching from URL:", `${process.env.NEXT_PUBLIC_SERVER_URL}/api/all-products`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/all-products`, {
      cache: "no-store",
    });
    const data = await response.json();
    return Response.json(data);
  }