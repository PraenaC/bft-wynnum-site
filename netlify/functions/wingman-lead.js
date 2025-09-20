// netlify/functions/wingman-lead.js
// Posts a lead to Wingman CRM using env vars:
// - WINGMAN_ENDPOINT  e.g. https://api.wingmancrm.com/v2/location/<LOCATION_ID>/leads
// - WINGMAN_API_KEY   your "pit-..." access token from Private Integrations

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse the incoming JSON body
    let payloadIn;
    try {
      payloadIn = JSON.parse(event.body || "{}");
    } catch {
      return { statusCode: 400, body: "Bad Request: invalid JSON" };
    }

    const { name, email, phone, message } = payloadIn;
    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const endpoint = process.env.WINGMAN_ENDPOINT;
    const apiKey   = process.env.WINGMAN_API_KEY;
    if (!endpoint || !apiKey) {
      return { statusCode: 500, body: "Server misconfigured (env vars)" };
    }

    // Map to Wingman’s expected field names (number = phone)
    const wingmanBody = {
      name,
      email,
      number: phone,
      notes: message || "",
      source: "BFT Wynnum website",
    };

    // Call Wingman – Private Integrations use the `x-api-key` header
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(wingmanBody),
    });

    const text = await res.text();
    // If Wingman didn’t like it, bubble the error (helps debugging in Netlify logs)
    if (!res.ok) {
      console.error("[wingman-lead] Wingman error", res.status, text);
      return { statusCode: res.status, body: text || "Wingman error" };
    }

    // All good
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("[wingman-lead] Function crash:", err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
}
