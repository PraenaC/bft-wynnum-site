// netlify/functions/wingman-lead.js
// Creates an Opportunity in Wingman CRM using Private Integrations.
// Env vars (Project-level in Netlify):
//   WINGMAN_ENDPOINT = https://app.wingmancrm.com/v2/location/<LOCATION_ID>/opportunities
//   WINGMAN_API_KEY  = pit-... (your current token)

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

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || body.number || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    // Read & sanitize env values
    const rawEP = (process.env.WINGMAN_ENDPOINT || "").trim();
    const apiKey = (process.env.WINGMAN_API_KEY || "").trim();
    if (!rawEP || !apiKey) {
      return { statusCode: 500, body: "Server missing Wingman env vars" };
    }

    let endpoint = rawEP.replace(/^<|>$/g, ""); // strip any angle brackets
    // If someone pasted a dashboard URL, coerce it:
    const m = endpoint.match(/location\/([A-Za-z0-9]+)\/settings\/private-integrations/);
    if (m) endpoint = `https://app.wingmancrm.com/v2/location/${m[1]}/opportunities`;
    endpoint = endpoint
      .replace(/^https?:\/\/api\.wingmancrm\.com/i, "https://app.wingmancrm.com")
      .replace(/^https?:\/\/(?!app\.wingmancrm\.com)/i, "https://app.wingmancrm.com/")
      .replace(/\/leads\/?$/i, "/opportunities")
      .replace(/\/$/, "");

    // Build multipart/form-data — DO NOT set Content-Type manually
    const fd = new FormData();
    // Wingman commonly accepts these; include both phone & number to be safe
    fd.set("name", name);
    // Optional split for CRMs that like first/last:
    const [first, ...rest] = name.split(/\s+/);
    if (first) fd.set("first_name", first);
    if (rest.length) fd.set("last_name", rest.join(" "));
    fd.set("email", email);
    fd.set("phone", phone);
    fd.set("number", phone);
    if (message) fd.set("notes", message);
    fd.set("source", "BFT Wynnum website");

    console.log("[wingman-lead] POST", endpoint);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-api-key": apiKey, // let fetch set multipart boundary automatically
        "Accept": "application/json, text/plain, */*",
      },
      body: fd,
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("[wingman-lead] Wingman error", res.status, text);
      return { statusCode: res.status, body: text || "Wingman error" };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("[wingman-lead] Function error:", err);
    return { statusCode: 500, body: "Function error" };
  }
}
