export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Authentication failed" }, { status: response.status });
    }

    // Set HTTP-only secure cookie containing the JWT token
    const cookieString = `token=${data.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    }`;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieString,
      },
    });
  } catch (error) {
    console.error("Login proxy connection error:", error);
    return Response.json({ error: "Failed to connect to authentication server" }, { status: 500 });
  }
}
