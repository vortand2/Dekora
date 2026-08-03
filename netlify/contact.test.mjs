// Self-check for the contact function. Run: node netlify/contact.test.mjs
// No framework on purpose - it only needs to fail loudly if the logic breaks.
import assert from "node:assert/strict";

process.env.RESEND_API_KEY = "re_fake_test_key";
process.env.EMAIL_FROM_ADDRESS = "no-reply@dekoraclean.com";
process.env.OWNER_EMAIL = "owner@dekoraclean.com";

const { validate, buildEmailHtml, default: handler } = await import("./functions/contact.mjs");

// --- validation ---
assert.ok(validate({ name: "A", email: "a@b.co", phone: "1" }).data, "valid input rejected");
assert.ok(validate({ name: "", email: "a@b.co", phone: "1" }).error, "empty name accepted");
assert.ok(validate({ name: "A", email: "bad", phone: "1" }).error, "malformed email accepted");
assert.ok(validate({ name: "A".repeat(201), email: "a@b.co", phone: "1" }).error, "over-long name accepted");
assert.ok(validate({ name: {}, email: "a@b.co", phone: "1" }).error, "non-string accepted");
assert.equal(validate({ name: " A ", email: "a@b.co", phone: "1" }).data.name, "A", "not trimmed");

// --- email body ---
const html = buildEmailHtml(
  {
    name: '<img src=x onerror=alert(1)>',
    email: "a@b.co",
    phone: "1",
    service_type: "curtains",
    message: '<a href="http://evil">x</a>',
  },
  new Date("2026-08-03T10:30:00Z")
);
assert.ok(!html.includes("<img src=x"), "injected img tag survived escaping");
assert.ok(!html.includes('<a href="http://evil"'), "injected anchor survived escaping");
assert.ok(html.includes("Cortinas y Persianas"), "service label not translated");
assert.ok(html.includes("2026-08-03 10:30"), "timestamp wrong");

const unknown = buildEmailHtml(
  { name: "A", email: "a@b.co", phone: "1", service_type: "<b>x</b>", message: "" },
  new Date()
);
assert.ok(unknown.includes("&lt;b&gt;x&lt;/b&gt;"), "unknown service_type not escaped");
assert.ok(unknown.includes("Sin mensaje"), "empty message not defaulted");

// --- handler: happy path hits Resend with the right request ---
let captured;
global.fetch = async (url, opts) => {
  captured = { url, opts };
  return new Response(JSON.stringify({ id: "x" }), { status: 200 });
};
const post = (body) =>
  handler(new Request("https://example.test/api/contact", { method: "POST", body: JSON.stringify(body) }));

let res = await post({ name: "Juan Pérez", email: "juan@example.com", phone: "300", service_type: "carpets" });
assert.equal(res.status, 200, "happy path did not return 200");
assert.equal(captured.url, "https://api.resend.com/emails");
assert.equal(captured.opts.headers.Authorization, "Bearer re_fake_test_key");
const sent = JSON.parse(captured.opts.body);
assert.equal(sent.from, "Dekora Clean S.A.S <no-reply@dekoraclean.com>");
assert.deepEqual(sent.to, ["owner@dekoraclean.com"]);
assert.equal(sent.reply_to, "juan@example.com", "reply_to must be the submitter");

// --- handler: failure paths ---
global.fetch = async () => new Response("domain not verified", { status: 422 });
assert.equal((await post({ name: "A", email: "a@b.co", phone: "1" })).status, 502, "Resend failure not surfaced");
assert.equal((await handler(new Request("https://x", { method: "GET" }))).status, 405, "GET not rejected");
assert.equal(
  (await handler(new Request("https://x", { method: "POST", body: "not json" }))).status,
  400,
  "malformed JSON not rejected"
);
assert.equal((await post({ name: "A", email: "bad", phone: "1" })).status, 422, "invalid email not rejected");

console.log("contact function: all checks passed");
