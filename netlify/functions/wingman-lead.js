// netlify/functions/wingman-lead.js
// Uses env vars:
//  - WINGMAN_ENDPOINT (ex: https://app.wingmancrm.com/v2/location/<LOCATION_ID>/leads)
//  - WINGMAN_API_KEY  (your pit-... token from Private Integrations)

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name, email, phone, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const endpoint = process.env.WINGMAN_ENDPOINT;
    const token = process.env.WINGMAN_API_KEY;

    if (!endpoint || !token) {
      console.error("Missing env vars", { hasEndpoint: !!endpoint, hasToken: !!token });
      return { statusCode: 500, body: "Server missing Wingman env vars" };
    }

    // Payload: include both `phone` and `number` just in case.
    const payload = {
      name,
      email,
      phone,
      number: phone,
      notes: message || "",
      source: "BFT Wynnum website",
    };

    // Try multiple auth styles until one works (Wingman varies by account/version).
    const attempts = [
      { kind: "auth: Token token=", headers: { Authorization: `Token token=${token}` } },
      { kind: "auth: Bearer",       headers: { Authorization: `Bearer ${token}` } },
      { kind: "hdr: X-Access-Token",headers: { "X-Access-Token": token } },
      { kind: "hdr: Access-Token",  headers: { "Access-Token": token } },
      { kind: "hdr: X-Api-Key",     headers: { "X-Api-Key": token } },
      { kind: "hdr: Api-Key",       headers: { "Api-Key": token } },
      // last resort: query-string token
      { kind: "qs: access_token",   qs: `access_token=${encodeURIComponent(token)}` },
    ];

    let lastStatus = 0, lastBody = "";
    for (const a of attempts) {
      const url = a.qs ? (endpoint + (endpoint.includes("?") ? "&" : "?") + a.qs) : endpoint;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(a.headers || {}),
      };

      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
      lastStatus = res.status;
      lastBody = await res.text();

      // 2xx = success. Anything else: keep trying until we hit a non-401 or we run out.
      if (res.ok) {
        return { statusCode: 200, body: JSON.stringify({ ok: true }) };
      }
      if (res.status !== 401) {
        console.error("[wingman-lead] non-401 error", a.kind, res.status, lastBody.slice(0, 500));
        return { statusCode: 502, body: `Wingman responded ${res.status}: ${lastBody}` };
      }
      console.warn("[wingman-lead] 401 with attempt:", a.kind);
    }

    // If we’re here, every attempt returned 401.
    console.error("[wingman-lead] All auth attempts failed with 401. Sample body:", lastBody.slice(0, 500));
    return { statusCode: 401, body: "Authentication to Wingman failed (all methods)." };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
}
