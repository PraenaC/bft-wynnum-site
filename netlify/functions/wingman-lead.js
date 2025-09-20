// netlify/functions/wingman-lead.js
// Sends an enquiry to Wingman CRM using env vars:
// - WINGMAN_ENDPOINT  e.g. https://api.wingmancrm.com/v2/location/<LOCATION_ID>/opportunities
// - WINGMAN_API_KEY   your pit-... token

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name, email, phone, message } = JSON.parse(event.body || "{}");

    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const endpoint = process.env.WINGMAN_ENDPOINT;
    const apiKey   = process.env.WINGMAN_API_KEY;

    if (!endpoint || !apiKey) {
      return { statusCode: 500, body: "Server missing Wingman env vars" };
    }

    // Convert "Name" to first/last if possible (optional but nice)
    const [first_name, ...rest] = String(name).trim().split(/\s+/);
    const last_name = rest.join(" ");

    // Wingman commonly accepts these fields for opportunities/leads.
    // (We also send 'phone' and 'number' to cover both schemas.)
    const form = new FormData();
    form.append("first_name", first_name || name);
    if (last_name) form.append("last_name", last_name);
    form.append("name", name);
    form.append("email", email);
    form.append("phone", phone);
    form.append("number", phone);
    form.append("notes", message || "");
    form.append("source", "BFT Wynnum website");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-api-key": apiKey, // Wingman Private Integrations key header
      },
      body: form, // <-- multipart/form-data (boundary set automatically)
    });

    const text = await res.text();

    // Helpful logging to Netlify function logs:
    console.log("[wingman-lead] POST", endpoint, res.status);
    if (!res.ok) {
      console.error("[wingman-lead] Wingman error", res.status, text);
      return {
        statusCode: res.status,
        body: `Wingman error ${res.status}: ${text}`,
      };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("[wingman-lead] Function error:", err);
    return { statusCode: 500, body: `Function error: ${err.message}` };
  }
}
