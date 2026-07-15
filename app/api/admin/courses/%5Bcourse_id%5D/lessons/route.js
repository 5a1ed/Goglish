import { cookies } from "next/headers";

export async function POST(req, { params }) {
  try {
    const { course_id } = await params;
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`http://127.0.0.1:8000/api/courses/${course_id}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Failed to upload lesson" }, { status: response.status });
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Admin create lesson proxy error:", error);
    return Response.json({ error: "Failed to connect to course server" }, { status: 500 });
  }
}
