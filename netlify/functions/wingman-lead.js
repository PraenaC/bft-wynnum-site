// netlify/functions/wingman-lead.js
// Create a record in Wingman via Private Integrations.
// Tries base paths + buckets until one works.

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name, email, phone, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const API_KEY  = (process.env.WINGMAN_API_KEY || "").trim();
    const LOC_ID   = (process.env.WINGMAN_LOCATION_ID || "").trim();
    const INTEG_ID = (process.env.WINGMAN_INTEGRATION_ID || "").trim();

    if (!API_KEY || !LOC_ID || !INTEG_ID) {
      return { statusCode: 500, body: "Missing Wingman env vars" };
    }

    // Candidate base paths (some accounts use "private-integrations", others "integrations")
    const bases = [
      `https://app.wingmancrm.com/v2/location/${encodeURIComponent(LOC_ID)}/private-integrations/${encodeURIComponent(INTEG_ID)}`,
      `https://app.wingmancrm.com/v2/location/${encodeURIComponent(LOC_ID)}/integrations/${encodeURIComponent(INTEG_ID)}`
    ];
    const buckets = ["leads", "opportunities", "contacts"];

    // Wingman PI expects multipart/form-data
    const form = new FormData();
    form.set("name", name);
    form.set("email", email);
    form.set("number", phone);
    if (message) form.set("notes", message);
    form.set("source", "BFT Wynnum website");

    let lastStatus = 0, lastText = "";
    for (const base of bases) {
      for (const b of buckets) {
        const url = `${base}/${b}`;
        const res = await fetch(url, { method: "POST", headers: { "x-api-key": API_KEY }, body: form });
        const text = await res.text();
        if (res.ok) {
          return { statusCode: 200, body: JSON.stringify({ ok: true, path: `${base}/${b}` }) };
        }
        lastStatus = res.status;
        lastText = text;

        // If the error says the bucket doesn't exist, keep trying others.
        if (res.status === 404 && /NoSuchBucket/i.test(text)) continue;

        // For 400/401/403 etc., bubble up now so we see the real cause.
        console.error("[wingman-lead] POST", url, res.status, text);
        return { statusCode: res.status, body: text };
      }
    }

    console.error("[wingman-lead] No base/bucket matched:", lastStatus, lastText);
    return { statusCode: 404, body: "No matching Wingman endpoint (base/bucket) found." };
  } catch (err) {
    console.error("[wingman-lead] Function error", err);
    return { statusCode: 500, body: "Function error" };
  }
}
