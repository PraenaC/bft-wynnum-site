// netlify/functions/wingman-lead.js
// Posts a lead to Wingman Private Integration (Form Capture)
// Preferred env vars (project-level):
//   WINGMAN_LOCATION_ID       = EUFMfUAuBBFpnJKSD0FW
//   WINGMAN_INTEGRATION_ID    = <your 24-char integration id>
//   WINGMAN_API_KEY           = pit-... (token)
// Optional fallback (if you can't set the two IDs above):
//   WINGMAN_ENDPOINT          = can be either the final /integrations/<id>/leads URL
//                               OR the settings URL (.../settings/private-integrations/<id>)

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // ---- Parse incoming body
    let body;
    try { body = JSON.parse(event.body || "{}"); }
    catch { return { statusCode: 400, body: "Invalid JSON" }; }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || body.number || "").trim();
    const message = String(body.message || "").trim();
    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    // ---- Read env
    const locId = (process.env.WINGMAN_LOCATION_ID || "").trim();
    const integId = (process.env.WINGMAN_INTEGRATION_ID || "").trim();
    const apiKey = (process.env.WINGMAN_API_KEY || "").trim();
    let ep = (process.env.WINGMAN_ENDPOINT || "").trim().replace(/^<|>$/g, "");

    if (!apiKey) {
      return { statusCode: 500, body: "Server missing WINGMAN_API_KEY" };
    }

    // ---- Build the endpoint robustly
    let endpoint = "";
    if (locId && integId) {
      endpoint = `https://app.wingmancrm.com/v2/location/${locId}/integrations/${integId}/leads`;
    } else if (ep) {
      // Accept either a settings URL or a final leads URL
      // Settings URL -> extract ids
      const m1 = ep.match(/location\/([A-Za-z0-9]+)\/settings\/private-integrations\/([A-Za-z0-9]+)/);
      if (m1) {
        endpoint = `https://app.wingmancrm.com/v2/location/${m1[1]}/integrations/${m1[2]}/leads`;
      } else {
        // If it's already a leads URL, normalize domain & strip trailing slash
        endpoint = ep
          .replace(/^https?:\/\/api\.wingmancrm\.com/i, "https://app.wingmancrm.com")
          .replace(/^https?:\/\/(?!app\.wingmancrm\.com)/i, "https://app.wingmancrm.com/")
          .replace(/\/$/, "");
      }
    }

    if (!endpoint) {
      return { statusCode: 500, body: "Server missing Wingman endpoint/ids" };
    }

    // ---- Build multipart/form-data (do NOT set Content-Type)
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

    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("[wingman-lead] Function error:", err);
    return { statusCode: 500, body: "Function error" };
  }
}
