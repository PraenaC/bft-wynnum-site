export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { name, email, phone } = body;
    if (!name || !email || !phone) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing name, email or phone" }) };
    }

    const WINGMAN_PIT = process.env.WINGMAN_PIT;
    const WINGMAN_API_URL = process.env.WINGMAN_API_URL; // e.g. https://api.wingmancrm.com/v2/leads
    if (!WINGMAN_PIT || !WINGMAN_API_URL) {
      return { statusCode: 500, body: JSON.stringify({ error: "Server not configured" }) };
    }

    const payload = {
      name,
      email,
      number: phone,
      source: "bft-wynnum-28-day-kickstart"
    };

    const r = await fetch(WINGMAN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${WINGMAN_PIT}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      return { statusCode: 502, body: JSON.stringify({ error: "Wingman error", details: text }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "Unexpected server error" }) };
  }
}
