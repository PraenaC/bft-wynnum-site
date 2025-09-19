// netlify/functions/wingman-lead.js
// Sends an enquiry to Wingman CRM using env vars:
//
// WINGMAN_ENDPOINT  e.g. https://app.wingmancrm.com/v2/location/<LOCATION_ID>/leads
// WINGMAN_API_KEY   your pit-... token from Wingman (Private Integrations)

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
    const apiKey = process.env.WINGMAN_API_KEY;
    if (!endpoint || !apiKey) {
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

    // Use x-api-key header for Wingman Private Integrations
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
      // Bubble up Wingman’s response to the Netlify logs to make debugging easy
      return {
        statusCode: res.status,
        body: `Wingman error ${res.status}: ${text}`,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return { statusCode: 500, body: `Function error: ${err.message}` };
  }
}
