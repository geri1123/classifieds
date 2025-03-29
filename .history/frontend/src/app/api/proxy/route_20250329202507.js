import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Get token from headers
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Get the category from query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'All';

    // Fetch data from Express backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-products?category=${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Pass token in headers
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
}