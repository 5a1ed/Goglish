import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the incoming multipart form data
    const formData = await req.formData();

    // Forward it directly to the FastAPI backend
    const response = await fetch("http://127.0.0.1:8000/api/courses/upload-video", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Do NOT set Content-Type header. Fetch will auto-generate boundary.
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Video upload failed" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Video upload proxy error:", error);
    return Response.json({ error: "Failed to connect to video server" }, { status: 500 });
  }
}
