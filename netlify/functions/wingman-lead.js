// Sends a lead to Wingman CRM (Private Integrations).
// Required env vars:
//   WINGMAN_ENDPOINT = https://app.wingmancrm.com/v2/location/<LOCATION_ID>/integrations/<INTEGRATION_ID>/leads
//   WINGMAN_API_KEY  = pit-xxxxxxxx (current token)

const ok = (headers, data) => ({
  statusCode: 200,
  headers,
  body: JSON.stringify(data ?? { ok: true }),
});

const fail = (headers, status, msg, extra = {}) => ({
  statusCode: status,
  headers,
  body: JSON.stringify({ error: msg, ...extra }),
});

const corsHeaders = (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "*";
  // Reflect whitelisted origins, otherwise fall back to "*"
  const allow =
    /localhost(:\d+)?$|netlify\.app$/i.test(origin) ? origin : "*";

  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
};

export async function handler(event) {
  const headers = corsHeaders(event);

  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return fail(headers, 405, "Method Not Allowed");
  }

  // Parse and validate input
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return fail(headers, 400, "Invalid JSON body");
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || body.number || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !phone) {
    return fail(headers, 400, "Missing required fields", {
      required: ["name", "email", "phone"],
    });
  }

  // Env vars
  const endpoint = process.env.WINGMAN_ENDPOINT;
  const apiKey = process.env.WINGMAN_API_KEY;

  if (!endpoint || !apiKey) {
    return fail(headers, 500, "Server misconfiguration", {
      missing: {
        WINGMAN_ENDPOINT: !endpoint,
        WINGMAN_API_KEY: !apiKey,
      },
    });
  }

  // Map to Wingman’s expected fields
  const payload = {
    name,
    email,
    number: phone,            // Wingman expects "number" for phone
    notes: message || "",
    source: "BFT Wynnum website kickstart form",
  };

  // Call Wingman (use Bearer auth; host must be app.wingmancrm.com)
  let res, text;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    text = await res.text(); // Wingman may return JSON or empty; text keeps logs readable
  } catch (err) {
    return fail(headers, 502, "Network error contacting Wingman", {
      details: err.message,
    });
  }

  if (!res.ok) {
    // Forward Wingman response to logs/clients for quick debugging
    return fail(headers, res.status, "Wingman request failed", {
      wingmanStatus: res.status,
      wingmanBody: text,
    });
  }

  // Success
  return ok(headers, { ok: true });
}
