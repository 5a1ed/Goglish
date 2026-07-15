export async function POST(req) {
  try {
    const body = await req.json();
    const response = await fetch("http://127.0.0.1:8000/api/payments/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.detail || "Webhook processing failed" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Failed to connect to payment server" }, { status: 500 });
  }
}
