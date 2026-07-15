import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch("http://127.0.0.1:8000/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Unauthorized" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Auth me proxy error:", error);
    return Response.json({ error: "Failed to connect to authentication server" }, { status: 500 });
  }
}
