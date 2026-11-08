import nodemailer from "nodemailer";

// "Start your project" form → email to Geetha via Gmail (App Password).
// Needs GMAIL_USER and GMAIL_APP_PASSWORD in the environment (see .env.example).
export const runtime = "nodejs";

const TO = process.env.ENQUIRY_TO || "geethakrishna.designer@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 200, service: 120, brief: 2000 };

// Light abuse guard: at most 5 enquiries per address per 10 minutes (per server instance).
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const service = clean(body.service, LIMITS.service);
  const brief = clean(body.brief, LIMITS.brief);
  if (!name || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "Please add your name and a valid email." }, { status: 400 });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many enquiries. Please try again later." }, { status: 429 });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("[enquiry] GMAIL_USER / GMAIL_APP_PASSWORD are not set; enquiry not sent.");
    return Response.json({ ok: false, error: "Email is not set up yet." }, { status: 503 });
  }

  const subject = `${service || "Project"} enquiry from ${name}`;
  const text = [
    "New enquiry from your portfolio site",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Service: ${service || "Not specified"}`,
    "",
    "Brief:",
    brief || "(none)",
  ].join("\n");
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top">${k}</td><td style="padding:6px 0">${v}</td></tr>`;
  const html =
    `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">` +
    `<p style="margin:0 0 12px"><strong>New enquiry from your portfolio site</strong></p>` +
    `<table style="border-collapse:collapse">` +
    row("Name", escapeHtml(name)) +
    row("Email", `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`) +
    row("Service", escapeHtml(service || "Not specified")) +
    `</table>` +
    `<p style="margin:16px 0 4px;color:#666">Brief</p>` +
    `<p style="margin:0;white-space:pre-wrap">${escapeHtml(brief || "(none)")}</p>` +
    `<p style="margin:20px 0 0;color:#888;font-size:13px">Hit Reply to answer ${escapeHtml(name)} directly.</p></div>`;

  try {
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transport.sendMail({
      from: `"Portfolio enquiry" <${user}>`,
      to: TO,
      replyTo: { name, address: email },
      subject,
      text,
      html,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[enquiry] send failed:", err instanceof Error ? err.message : err);
    return Response.json({ ok: false, error: "Couldn't send right now." }, { status: 502 });
  }
}
