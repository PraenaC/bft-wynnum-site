// netlify/functions/wingman-lead.js
export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: false, error: "Method Not Allowed" }),
    };
  }

  try {
    const { name, email, phone, message } = JSON.parse(event.body || "{}");

    if (!name || !email || !phone) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ ok: false, error: "Missing required fields." }),
      };
    }

    // ---- Configure via Netlify env vars ----
    // WINGMAN_ENDPOINT: the full URL your Wingman rep gave you (webhook / API)
    // WINGMAN_API_KEY: optional; if your endpoint needs Bearer auth
    const ENDPOINT = process.env.WINGMAN_ENDPOINT;
    const API_KEY  = process.env.WINGMAN_API_KEY || "";

    // DRY-RUN / TEST MODE (lets the page succeed so you can verify end-to-end)
    if (!ENDPOINT) {
      console.log("[wingman-lead] TEST MODE — no WINGMAN_ENDPOINT set", {
        name,
        email,
        phone,
        message,
      });
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ ok: true, testMode: true }),
      };
    }

    // Build a payload Wingman can accept (adjust keys if your endpoint differs)
    const payload = {
      name,
      email,
      number: phone,         // <— many CRMs use "number" not "phone"
      message,
      source: "BFT Wynnum Landing",
    };

    const headers = { "Content-Type": "application/json" };
    if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`;

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[wingman-lead] Wingman error", res.status, text);
      return {
        statusCode: 502,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          ok: false,
          error: `Wingman responded ${res.status}`,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("[wingman-lead] Unhandled error", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: false, error: "Server error" }),
    };
  }
}
