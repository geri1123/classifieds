import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const token = cookies().get("token")?.value; // Get JWT token from cookies
    if (!token) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Get the category from query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "All";

    // Fetch data from Express backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass token in headers
      },
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    return Response.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
  }
}