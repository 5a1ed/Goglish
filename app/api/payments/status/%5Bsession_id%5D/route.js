import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    const { session_id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`http://127.0.0.1:8000/api/payments/status/${session_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Failed to fetch status" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Failed to connect to payment server" }, { status: 500 });
  }
}
