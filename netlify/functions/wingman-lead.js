// netlify/functions/wingman-lead.js
// Sends an enquiry to Wingman CRM using env vars:
// - WINGMAN_ENDPOINT  e.g. https://api.wingmancrm.com/v2/location/<LOCATION_ID>/leads
// - WINGMAN_API_KEY   your pit-... token

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
    const apiKey   = process.env.WINGMAN_API_KEY;

    if (!endpoint || !apiKey) {
      return { statusCode: 500, body: "Server missing Wingman env vars" };
    }

    // Build multipart/form-data (Node 18+ has FormData globally)
    const fd = new FormData();
    fd.set("name",   name);
    fd.set("email",  email);
    fd.set("number", phone);          // Wingman expects 'number' for phone
    if (message) fd.set("notes", message);
    fd.set("source", "BFT Wynnum website");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "x-api-key": apiKey }, // don't set Content-Type; fetch will add boundary
      body: fd,
    });

    const text = await res.text();
    if (!res.ok) {
      // Bubble Wingman’s error into Netlify logs for debugging
      return { statusCode: res.status, body: `Wingman error ${res.status}: ${text}` };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: `Function error: ${err.message}` };
  }
}
