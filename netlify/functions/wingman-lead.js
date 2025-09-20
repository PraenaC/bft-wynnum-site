// netlify/functions/wingman-lead.js
// Submits an enquiry to Wingman CRM.
// Behavior:
//   1) Attempts Private Integrations buckets (if enabled on your tenant)
//   2) Falls back to direct Location collections
//   3) If Wingman still rejects, the front-end will fall back to Netlify Forms.
//
// Required Netlify ENV VARS (Project level):
//   WINGMAN_API_KEY        = pit-... (current token from "BFT Website Leads")
//   WINGMAN_LOCATION_ID    = EUFMfUAuBBFpnJKSD0FW
//   WINGMAN_INTEGRATION_ID = 68ccffce94abafd3578f540c   (from your Edit URL)

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return { statusCode: 400, body: "Invalid JSON" };
    }

    const name    = String(body.name || "").trim();
    const email   = String(body.email || "").trim();
    const phone   = String(body.phone || body.number || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const API_KEY  = (process.env.WINGMAN_API_KEY || "").trim();
    const LOC_ID   = (process.env.WINGMAN_LOCATION_ID || "").trim();
    const INTEG_ID = (process.env.WINGMAN_INTEGRATION_ID || "").trim();

    if (!API_KEY || !LOC_ID) {
      return { statusCode: 500, body: "Server missing Wingman env vars" };
    }

    // Build multipart/form-data (Wingman expects this)
    const form = new FormData();
    form.set("name", name);
    const [first, ...rest] = name.split(/\s+/);
    if (first) form.set("first_name", first);
    if (rest.length) form.set("last_name", rest.join(" "));
    form.set("email", email);
    // Send both to cover schema differences
    form.set("phone", phone);
    form.set("number", phone);
    if (message) form.set("notes", message);
    form.set("source", "BFT Wynnum website");

    // 1) Try Private Integration buckets (some tenants require these)
    if (INTEG_ID) {
      const piBases = [
        `https://app.wingmancrm.com/v2/location/${encodeURIComponent(LOC_ID)}/private-integrations/${encodeURIComponent(INTEG_ID)}`,
        `https://app.wingmancrm.com/v2/location/${encodeURIComponent(LOC_ID)}/integrations/${encodeURIComponent(INTEG_ID)}`,
      ];
      const buckets = ["leads", "opportunities", "contacts"];

      for (const base of piBases) {
        for (const b of buckets) {
          const url = `${base}/${b}`;
          const res = await fetch(url, { method: "POST", headers: { "x-api-key": API_KEY }, body: form });
          const text = await res.text();
          if (res.ok) {
            console.log("[wingman-lead] SUCCESS via PI:", url);
            return { statusCode: 200, body: JSON.stringify({ ok: true, via: url }) };
          }
          if (res.status === 404 && /NoSuchBucket/i.test(text)) {
            console.warn("[wingman-lead] PI bucket missing:", url);
            continue;
          }
          // Bubble up other errors for visibility (auth/validation)
          if (!res.ok) {
            console.error("[wingman-lead] PI error", res.status, text);
            return { statusCode: res.status, body: text };
          }
        }
      }
    }

    // 2) Fallback to direct location collections (common on many tenants)
    const collections = ["opportunities", "leads", "contacts"];
    for (const coll of collections) {
      const url = `https://app.wingmancrm.com/v2/location/${encodeURIComponent(LOC_ID)}/${coll}`;
      const res = await fetch(url, { method: "POST", headers: { "x-api-key": API_KEY }, body: form });
      const text = await res.text();
      if (res.ok) {
        console.log("[wingman-lead] SUCCESS via direct:", url);
        return { statusCode: 200, body: JSON.stringify({ ok: true, via: url }) };
      }
      if (res.status === 404) {
        console.warn("[wingman-lead] 404 on", url, text);
        continue;
      }
      console.error("[wingman-lead] Direct error", res.status, text);
      return { statusCode: res.status, body: text };
    }

    // 3) If nothing worked, signal front-end to run the Netlify Forms fallback
    console.error("[wingman-lead] No PI buckets or direct collections worked.");
    return { statusCode: 502, body: "Wingman unavailable" };
  } catch (err) {
    console.error("[wingman-lead] Function error", err);
    return { statusCode: 500, body: "Function error" };
  }
}
