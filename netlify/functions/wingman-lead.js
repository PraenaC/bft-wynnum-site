// netlify/functions/wingman-lead.js
// Uses env vars:
// - WINGMAN_ENDPOINT: https://app.wingmancrm.com/v2/location/<LOCATION_ID>/leads
// - WINGMAN_API_KEY : pit-... token from Private Integrations

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

    // Build multipart/form-data body
    const form = new FormData();
    form.append("name", name);
    form.append("email", email);
    form.append("number", phone);          // Wingman expects "number" for phone
    form.append("notes", message || "");
    form.append("source", "BFT Wynnum website");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        // DO NOT set Content-Type manually (lets fetch add boundary)
        "X-api-key": apiKey,
      },
      body: form,
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
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}
