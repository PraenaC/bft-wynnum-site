// netlify/functions/wingman-lead.js
// Submits a lead to Wingman CRM.
// 1) Try Private Integrations buckets (if available)
// 2) Fallback to direct location collections (opportunities/leads/contacts)

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name, email, phone, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !phone) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const API_KEY  = (process.env.WINGMAN_API_KEY || "").trim();
    const LOC_ID   = (process.env.WINGMAN_LOCATION_ID || "").trim();
    const INTEG_ID = (process.env.WINGMAN_INTEGRATION_ID || "").trim();

    if (!API_KEY || !LOC_ID) {
      return { statusCode: 500, body: "Missing Wingman env vars" };
    }

    // Build form-data Wingman expects
    const form = new FormData();
    form.set("name", name);
    form.set("email", email);
    form.set("number", phone);
    form.set("source", "BFT Wynnum website");
    if (message) form.set("notes", message);

    // --- 1) Try Private Integrations buckets (if present) ---
    if (INTEG_ID) {
      const piBases = [
        `https://app.wingmancrm.com/v2/location/${encodeURIComponent(LOC_ID)}/private-integrations/${encodeURIComponent(INTEG_ID)}`,
        `https://app.wingmancrm.com/v2/location/${encodeURIComponent(LOC_ID)}/integrations/${encodeURIComponent(INTEG_ID)}`
      ];
      const buckets = ["leads", "opportunities", "contacts"];

      for (const base of piBases) {
        for (const b of buckets) {
          const url = `${base}/${b}`;
          const res = await fetch(url, { method: "POST", headers: { "x-api-key": API_KEY }, body: form });
          const text = await res.text();
          if (res.ok) {
            console.log("[wingman-lead] SUCCESS via PI:", url);
            return { statusCode: 200, body: JSON.stringify({ ok: true, via: url }) };
          }
          // Keep trying buckets if it's a "NoSuchBucket"
          if (res.status === 404 && /NoSuchBucket/i.test(text)) {
            console.warn("[wingman-lead] PI bucket missing:", url);
            continue;
          }
          // Bubble other errors for visibility
          if (!res.ok) {
            console.error("[wingman-lead] PI error", res.status, text);
            return { statusCode: res.status, body: text };
          }
        }
      }
    }

    // --- 2) Fallback to direct location collections ---
    // These exist for most accounts and accept multipart/form-data.
    const directCollections = ["opportunities", "leads", "contacts"];

    for (const coll of directCollections) {
      const url = `https://app.wingmancrm.com/v2/location/${encodeURIComponent(LOC_ID)}/${coll}`;
      const res = await fetch(url, { method: "POST", headers: { "x-api-key": API_KEY }, body: form });
      const text = await res.text();
      if (res.ok) {
        console.log("[wingman-lead] SUCCESS via direct:", url);
        return { statusCode: 200, body: JSON.stringify({ ok: true, via: url }) };
      }
      // If 404 on one collection, try the next
      if (res.status === 404) {
        console.warn("[wingman-lead] 404 on", url, text);
        continue;
      }
      // Any other error: surface it so we can fix scopes/permissions
      console.error("[wingman-lead] Direct error", res.status, text);
      return { statusCode: res.status, body: text };
    }

    // If we got here, nothing matched
    console.error("[wingman-lead] No PI buckets or direct collections worked.");
    return { statusCode: 404, body: "No matching Wingman endpoint found (PI buckets and direct collections failed)." };
  } catch (err) {
    console.error("[wingman-lead] Function error", err);
    return { statusCode: 500, body: "Function error" };
  }
}
