import { cookies } from "next/headers";

export async function DELETE(req, { params }) {
  try {
    const { lesson_id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`http://127.0.0.1:8000/api/courses/lessons/${lesson_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Failed to delete lesson" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Admin delete lesson proxy error:", error);
    return Response.json({ error: "Failed to connect to course server" }, { status: 500 });
  }
}
