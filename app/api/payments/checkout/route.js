import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch("http://127.0.0.1:8000/api/payments/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Checkout failed" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Failed to connect to payment server" }, { status: 500 });
  }
}
