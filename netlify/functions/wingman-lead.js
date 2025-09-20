// netlify/functions/wingman-lead.js
// Posts a lead to Wingman Private Integration (Form Capture)
// Env vars:
//   WINGMAN_ENDPOINT = https://app.wingmancrm.com/v2/location/<LOC>/integrations/<INT>/leads
//   WINGMAN_API_KEY  = pit-... (token)

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

    // Read env
    let endpoint = (process.env.WINGMAN_ENDPOINT || "").trim().replace(/^<|>$/g, "");
    const apiKey = (process.env.WINGMAN_API_KEY || "").trim();

    if (!endpoint || !apiKey) {
      return { statusCode: 500, body: "Server missing Wingman env vars" };
    }

    // If a dashboard URL was pasted by mistake, convert it to the leads endpoint
    const dash = endpoint.match(
      /wingmancrm\.com\/v2\/location\/([A-Za-z0-9]+)\/settings\/private-integrations\/([A-Za-z0-9]+)/
    );
    if (dash) {
      const loc = dash[1];
      const integ = dash[2];
      endpoint = `https://app.wingmancrm.com/v2/location/${loc}/integrations/${integ}/leads`;
    }

    // Ensure we are on the app domain and not altering the route
    if (!/^https?:\/\/app\.wingmancrm\.com\//i.test(endpoint)) {
      endpoint = endpoint.replace(/^https?:\/\/[^/]+/i, "https://app.wingmancrm.com");
    }
    endpoint = endpoint.replace(/\/$/, ""); // no trailing slash

    // Build multipart/form-data (do NOT set Content-Type manually)
    const fd = new FormData();
    fd.set("name", name);
    const [first, ...rest] = name.split(/\s+/);
    if (first) fd.set("first_name", first);
    if (rest.length) fd.set("last_name", rest.join(" "));
    fd.set("email", email);
    fd.set("phone", phone);
    fd.set("number", phone); // cover both schemas
    if (message) fd.set("notes", message);
    fd.set("source", "BFT Wynnum website");

    console.log("[wingman-lead] POST", endpoint);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
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
