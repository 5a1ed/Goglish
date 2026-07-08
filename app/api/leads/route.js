export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received data:", body);

    const response = await fetch(
      "https://hook.eu2.make.com/5wlk6xjuiwulk6mwhl5v6ld4efk57jaw",
      {
        method: "POST", // ✅ مهم جدًا
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          phone: body.phone,
          grade: body.grade,
          date: new Date().toISOString(), // ✅ إضافة احترافية
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send data to Make");
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("ERROR:", error);
    return Response.json({ success: false });
  }
}
