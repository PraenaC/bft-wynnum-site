// netlify/functions/wingman-lead.js
// Creates a record in Wingman CRM Private Integrations, trying common object buckets.

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name, email, phone, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const API_KEY   = (process.env.WINGMAN_API_KEY || "").trim();
    const LOCATION  = (process.env.WINGMAN_LOCATION_ID || "").trim();
    const INTEG_ID  = (process.env.WINGMAN_INTEGRATION_ID || "").trim();

    if (!API_KEY || !LOCATION || !INTEG_ID) {
      return { statusCode: 500, body: "Missing Wingman env vars" };
    }

    const base =
      `https://app.wingmancrm.com/v2/location/${encodeURIComponent(LOCATION)}` +
      `/integrations/${encodeURIComponent(INTEG_ID)}`;

    // Wingman expects multipart/form-data on Private Integrations object POSTs
    const form = new FormData();
    form.set("name", name);
    form.set("email", email);
    form.set("number", phone);
    if (message) form.set("notes", message);
    form.set("source", "BFT Wynnum website");

    // Try buckets in order; stop on first 2xx
    const buckets = ["leads", "opportunities", "contacts"];
    let lastText = "";
    for (const b of buckets) {
      const url = `${base}/${b}`;
      const res = await fetch(url, { method: "POST", headers: { "x-api-key": API_KEY }, body: form });
      const text = await res.text();
      if (res.ok) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, bucket: b }) };
      }
      lastText = text;
      // If the bucket literally doesn't exist, try the next one
      if (res.status === 404 && /NoSuchBucket/i.test(text)) {
        continue;
      }
      // For other errors (401/403/400), bubble up now so we see the real cause
      console.error("[wingman-lead]", b, res.status, text);
      return { statusCode: res.status, body: text };
    }

    // We tried all known buckets and all said NoSuchBucket
    console.error("[wingman-lead] All buckets missing:", lastText);
    return { statusCode: 404, body: "No matching Wingman bucket (leads/opportunities/contacts) found." };
  } catch (err) {
    console.error("[wingman-lead] Function error", err);
    return { statusCode: 500, body: "Function error" };
  }
}
