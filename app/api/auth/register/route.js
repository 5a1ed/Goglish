export async function POST(req) {
  try {
    const body = await req.json();
    const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Registration failed" }, { status: response.status });
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Registration proxy connection error:", error);
    return Response.json({ error: "Failed to connect to authentication server" }, { status: 500 });
  }
}
