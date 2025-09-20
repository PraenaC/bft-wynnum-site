// netlify/functions/wingman-lead.js
// Creates a Lead in Wingman CRM (Private Integrations)

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name, email, phone, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const API_KEY = (process.env.WINGMAN_API_KEY || "").trim();
    const LOCATION = (process.env.WINGMAN_LOCATION_ID || "").trim();
    const INTEGRATION = (process.env.WINGMAN_INTEGRATION_ID || "").trim();

    if (!API_KEY || !LOCATION || !INTEGRATION) {
      return { statusCode: 500, body: "Missing Wingman env vars" };
    }

    const endpoint =
      `https://app.wingmancrm.com/v2/location/${encodeURIComponent(LOCATION)}` +
      `/integrations/${encodeURIComponent(INTEGRATION)}/leads`;

    // Wingman’s Private Integrations /leads endpoint expects multipart/form-data
    const form = new FormData();
    form.set("name", name);
    form.set("email", email);
    form.set("number", phone);
    if (message) form.set("notes", message);
    form.set("source", "BFT Wynnum website");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "x-api-key": API_KEY }, // let fetch set the multipart boundary
      body: form,
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("[wingman-lead] Wingman error", res.status, text);
      return { statusCode: res.status, body: text };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("[wingman-lead] Function error", err);
    return { statusCode: 500, body: "Function error" };
  }
}
