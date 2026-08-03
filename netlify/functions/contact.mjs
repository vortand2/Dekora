// Contact form -> email notification via Resend.
// Replaces the FastAPI backend: the form's only production job was to notify the
// owner, so there is no database and no server to keep awake.

const RESEND_API_URL = "https://api.resend.com/emails";
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Dekora Clean S.A.S";
// Must be a domain verified in Resend; onboarding@resend.dev only reaches the account owner.
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || "onboarding@resend.dev";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "j-var79@gmail.com";

const SERVICE_LABELS = {
  curtains: "Cortinas y Persianas",
  carpets: "Alfombras y Tapetes",
  furniture: "Lavado de Muebles",
  linens: "Lencería y Ropa de Cama",
  flooring: "Pisos de Madera y Laminados",
  automotive: "Tapicería Automotriz",
  repairs: "Arreglos Locativos",
  laundry: "Lavandería y Sastrería",
};

const MAX = { name: 200, email: 320, phone: 50, service_type: 60, message: 5000 };

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

// Deliberately permissive - matches what a browser's type="email" accepts.
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function validate(body) {
  const out = {};
  for (const field of ["name", "email", "phone", "service_type", "message"]) {
    const raw = body?.[field];
    if (raw !== undefined && raw !== null && typeof raw !== "string") {
      return { error: `${field} must be a string` };
    }
    const value = (raw ?? "").trim();
    if (value.length > MAX[field]) return { error: `${field} is too long` };
    out[field] = value;
  }
  if (!out.name || !out.email || !out.phone) {
    return { error: "name, email and phone are required" };
  }
  if (!isEmail(out.email)) return { error: "invalid email" };
  return { data: out };
}

export function buildEmailHtml(contact, now) {
  const service = escapeHtml(
    SERVICE_LABELS[contact.service_type] || contact.service_type || "No especificado"
  );
  const name = escapeHtml(contact.name);
  const email = escapeHtml(contact.email);
  const phone = escapeHtml(contact.phone);
  const message = escapeHtml(contact.message || "Sin mensaje");
  const received = now.toISOString().slice(0, 16).replace("T", " ");
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafb;padding:24px;font-family:Arial,sans-serif;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8ecef;">
          <tr><td style="background:#2ED573;padding:24px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;">Dekora Clean S.A.S</h1>
            <p style="margin:4px 0 0;color:#ffffff;font-size:13px;">Nueva solicitud de cotización</p>
          </td></tr>
          <tr><td style="padding:32px;">
            <p style="margin:0 0 16px;color:#1e272e;font-size:15px;">Has recibido una nueva solicitud desde el sitio web:</p>
            <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px;color:#1e272e;">
              <tr><td style="width:140px;color:#57606f;font-weight:bold;">Nombre:</td><td>${name}</td></tr>
              <tr><td style="color:#57606f;font-weight:bold;">Correo:</td><td>${email}</td></tr>
              <tr><td style="color:#57606f;font-weight:bold;">Teléfono:</td><td>${phone}</td></tr>
              <tr><td style="color:#57606f;font-weight:bold;">Servicio:</td><td>${service}</td></tr>
              <tr><td style="color:#57606f;font-weight:bold;vertical-align:top;">Mensaje:</td><td>${message}</td></tr>
            </table>
          </td></tr>
          <tr><td style="background:#1e272e;padding:16px 32px;">
            <p style="margin:0;color:#a4b0be;font-size:12px;">Recibido el ${received} UTC</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  `;
}

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async function handler(request) {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const { data, error } = validate(body);
  if (error) return json(422, { error });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Fail loudly: with no database, an unsent email means the lead is gone.
    console.error("RESEND_API_KEY not set - cannot deliver contact form submission");
    return json(500, { error: "Email is not configured" });
  }

  let resendResponse;
  try {
    resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`,
        to: [OWNER_EMAIL],
        subject: `Nueva cotización de ${data.name} - Dekora Clean`,
        html: buildEmailHtml(data, new Date()),
        reply_to: data.email,
      }),
    });
  } catch (err) {
    console.error("Resend request failed:", err.message);
    return json(502, { error: "Could not send email" });
  }

  if (!resendResponse.ok) {
    const detail = await resendResponse.text();
    console.error(`Resend returned ${resendResponse.status}: ${detail}`);
    return json(502, { error: "Could not send email" });
  }

  return json(200, { success: true, message: "Formulario enviado exitosamente." });
}
