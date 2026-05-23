const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "zidateothmane1@gmail.com";
const EMAIL_FROM = process.env.EMAIL_FROM || "orders@yourdomain.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

function field(label, value) {
  return `<tr><td style="padding:8px 12px;font-weight:700;color:#77736a;">${label}</td><td style="padding:8px 12px;color:#0b0b0a;">${value || "-"}</td></tr>`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return { statusCode: 500, body: JSON.stringify({ error: "Email service is not configured" }) };
  }

  try {
    const order = JSON.parse(event.body || "{}");
    const html = `
      <div style="font-family:Arial,sans-serif;background:#fffdf8;padding:24px;">
        <h1 style="color:#0b0b0a;letter-spacing:2px;">New ZIDATE COD Order</h1>
        <p style="color:#77736a;">Payment method: Cash on Delivery</p>
        <table style="border-collapse:collapse;background:#ffffff;border:1px solid #ece9e1;border-radius:12px;overflow:hidden;">
          ${field("First name", order.first_name)}
          ${field("Last name", order.last_name)}
          ${field("Phone number", order.phone)}
          ${field("City", order.city)}
          ${field("Home address", order.address)}
          ${field("Product name", order.product_name)}
          ${field("Product color", order.product_color)}
          ${field("Product slug", order.product_slug)}
          ${field("Selected offer", order.offer)}
          ${field("Size", order.size)}
          ${field("Quantity", order.quantity)}
          ${field("Estimated total", order.estimated_total ? `${order.estimated_total} DH` : "-")}
          ${field("Notes", order.notes)}
          ${field("Payment method", order.payment_method || "Cash on Delivery")}
          ${field("Created date/time", order.created_at)}
        </table>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: ADMIN_EMAIL,
        subject: "New ZIDATE COD Order",
        html,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Resend email failed", details);
      return { statusCode: 502, body: JSON.stringify({ error: "Email send failed" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    console.error("Order email function error", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Email function failed" }) };
  }
};
