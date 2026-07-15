import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch("http://127.0.0.1:8000/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Failed to create course" }, { status: response.status });
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Admin create course proxy error:", error);
    return Response.json({ error: "Failed to connect to course server" }, { status: 500 });
  }
}
