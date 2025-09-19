// netlify/functions/wingman-lead.js
// Sends an enquiry to Wingman CRM using env vars:
//  - WINGMAN_ENDPOINT  e.g. https://app.wingmancrm.com/v2/location/<LOCATION_ID>/leads
//  - WINGMAN_API_KEY   your pit-... token

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
      return { statusCode: 500, body: "Server missing Wingman env vars" };
    }

    // Map to Wingman’s expected field names (number = phone)
    const payload = {
      name,
      email,
      number: phone,
      notes: message || "",
      source: "BFT Wynnum website",
    };

    // First try Bearer auth…
    let res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // …some Wingman tenants expect X-Access-Token instead
    if (res.status === 401 || res.status === 403) {
      res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": token,
        },
        body: JSON.stringify(payload),
      });
    }

    const text = await res.text();

    if (!res.ok) {
      // Surface Wingman’s message in Netlify logs to help debugging
      console.error("[wingman-lead] error", res.status, text);
      return { statusCode: res.status, body: text || "Wingman error" };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("[wingman-lead] exception", err);
    return { statusCode: 500, body: "Server error" };
  }
}
