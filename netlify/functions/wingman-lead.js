// netlify/functions/wingman-lead.js
// Creates an Opportunity in Wingman CRM using Private Integrations

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name, email, phone, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const raw = (process.env.WINGMAN_ENDPOINT || "").trim();
    const apiKey = (process.env.WINGMAN_API_KEY || "").trim();
    if (!raw || !apiKey) {
      return { statusCode: 500, body: "Server missing Wingman env vars" };
    }

    // --- Sanitize endpoint value ---
    let endpoint = raw.replace(/^<|>$/g, ""); // strip angle brackets if pasted

    // If a dashboard URL was pasted (…/settings/private-integrations/…), extract location id
    const m = endpoint.match(/location\/([A-Za-z0-9]+)\/settings\/private-integrations/);
    if (m) {
      endpoint = `https://app.wingmancrm.com/v2/location/${m[1]}/opportunities`;
    }

    // Force correct domain and collection
    endpoint = endpoint
      .replace(/^https?:\/\/api\.wingmancrm\.com/i, "https://app.wingmancrm.com")
      .replace(/^https?:\/\/(?!app\.wingmancrm\.com)/i, "https://app.wingmancrm.com/")
      .replace(/\/leads\/?$/i, "/opportunities")
      .replace(/\/$/, "");

    const payload = {
      name,
      email,
      number: phone,
      notes: message || "",
      source: "BFT Wynnum website",
    };

    console.log("[wingman-lead] POST", endpoint);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
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
