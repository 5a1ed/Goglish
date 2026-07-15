export async function GET() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/courses");
    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Failed to fetch courses" }, { status: response.status });
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Failed to connect to course server" }, { status: 500 });
  }
}
