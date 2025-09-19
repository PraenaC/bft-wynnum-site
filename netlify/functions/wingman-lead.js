// netlify/functions/wingman-lead.js
// Sends an enquiry to Wingman CRM using env vars:
// - WINGMAN_ENDPOINT  e.g. https://app.wingmancrm.com/v2/location/<LOCATION_ID>/leads
// - WINGMAN_API_KEY   your pit-... token

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
      console.error("Missing env vars", {
        hasEndpoint: !!endpoint,
        hasToken: !!token,
      });
      return { statusCode: 500, body: "Server missing Wingman env vars" };
    }

    // Map to Wingman's fields
    const payload = {
      name,
      email,
      phone,            // include both just in case
      number: phone,    // some APIs expect `number` for phone
      notes: message || "",
      source: "BFT Wynnum website",
    };

    // --- Try Wingman "Token token=" style first ---
    let res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token token=${token}`,
      },
      body: JSON.stringify(payload),
    });

    // If that fails auth, retry with Bearer
    if (res.status === 401) {
      res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    }

    const text = await res.text();
    if (!res.ok) {
      console.error("Wingman error", res.status, text);
      return {
        statusCode: 502,
        body: `Wingman responded ${res.status}: ${text}`,
      };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
}
