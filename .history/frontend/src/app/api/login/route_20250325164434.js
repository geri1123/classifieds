export async function POST(req) {
    try {
        const { identifier, user_password } = await req.json(); // Parse JSON body

        if (!identifier || !user_password) {
            return new Response(JSON.stringify({ errors: "Please fill in all fields." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Forward request to backend server
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", 
            body: JSON.stringify({ identifier, user_password }),
        });

        const data = await response.json();

        const setCookieHeader = response.headers.get("set-cookie");

      
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                "Content-Type": "application/json",
                ...(setCookieHeader ? { "set-cookie": setCookieHeader } : {}), // Pass cookie if exists
            },
        });

    } catch (error) {
        console.error("Login API error:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
