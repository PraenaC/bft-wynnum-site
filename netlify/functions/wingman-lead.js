// netlify/functions/wingman-lead.js
// Env vars required:
// - WINGMAN_ENDPOINT = https://api.wingmancrm.com/v2/location/<LOCATION_ID>/leads
// - WINGMAN_API_KEY  = pit-... token (current/primary)

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, email, phone, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const endpoint = process.env.WINGMAN_ENDPOINT;
    const apiKey = process.env.WINGMAN_API_KEY;
    if (!endpoint || !apiKey) {
      return { statusCode: 500, body: "Server missing Wingman env vars" };
    }

    // Build multipart/form-data (Node 18+/20+ has global FormData)
    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    // Wingman has used both "number" and "phone" in examples.
    fd.set("number", phone);
    fd.set("phone", phone);
    if (message) fd.set("notes", message);
    fd.set("source", "BFT Wynnum website");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-api-key": apiKey, // don't set Content-Type; fetch adds correct boundary
        "Accept": "application/json, text/plain, */*",
      },
      body: fd,
    });

    const text = await res.text();
    if (!res.ok) {
      // Return JSON so the front-end can show the real message
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: text.slice(0, 800) }),
      };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
