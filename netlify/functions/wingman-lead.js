// netlify/functions/wingman-lead.js
// Sends an enquiry to Wingman CRM using env vars:
// - WINGMAN_ENDPOINT  e.g. https://app.wingmancrm.com/v2/location/<LOCATION_ID>/leads
// - WINGMAN_API_KEY   your pit-... token from the Private Integration

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return respond(405, { ok: false, error: "Method Not Allowed" });
    }

    const { name, email, phone, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !phone) {
      return respond(400, { ok: false, error: "Missing required fields" });
    }

    const endpoint = process.env.WINGMAN_ENDPOINT;
    const apiKey   = process.env.WINGMAN_API_KEY;

    if (!endpoint || !apiKey) {
      return respond(500, { ok: false, error: "Server missing Wingman env vars" });
    }

    // Map to Wingman’s expected field names
    const payload = {
      name,
      email,
      number: phone,
      notes: message || "",
      source: "BFT Wynnum website",
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-api-key": apiKey,               // Private Integrations auth
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[wingman-lead] Wingman error", res.status, text);
      return respond(res.status, { ok: false, error: `Wingman ${res.status}`, detail: text });
    }

    return respond(200, { ok: true });
  } catch (err) {
    console.error("[wingman-lead] Function error", err);
    return respond(500, { ok: false, error: "Function error", detail: err.message });
  }
}

function respond(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      // Helpful if you ever load a preview from a different origin
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}
