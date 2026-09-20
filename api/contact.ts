// Contact form endpoint.
//
// The form used to hand off to a mailto: link, which silently did nothing for
// anyone without a desktop mail client configured. This sends the enquiry
// server-side instead, so a submission either arrives or reports why it did not.
//
// Environment (Vercel project settings):
//   RESEND_API_KEY     required, from resend.com
//   CONTACT_TO_EMAIL   where enquiries land
//   CONTACT_FROM_EMAIL sender on a domain verified with Resend

import type { VercelRequest, VercelResponse } from "@vercel/node";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const LIMITS = { name: 100, company: 100, email: 254, message: 5000, topics: 10 };

/** Deliberately loose: the only address that matters is one a reply can reach,
 *  and over-strict patterns reject valid addresses. Resend rejects the rest. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  message?: unknown;
  topics?: unknown;
  /** Honeypot. Hidden from people, irresistible to bots. */
  website?: unknown;
};

function asText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const body: Payload = typeof req.body === "string" ? safeParse(req.body) : (req.body ?? {});

  // A bot filled the hidden field. Answer as though it worked: telling a
  // scripted submitter it was rejected only invites a second attempt.
  if (asText(body.website, 100)) return res.status(200).json({ ok: true });

  const name = asText(body.name, LIMITS.name);
  const company = asText(body.company, LIMITS.company);
  const email = asText(body.email, LIMITS.email);
  const message = asText(body.message, LIMITS.message);
  const topics = Array.isArray(body.topics)
    ? body.topics.filter((t): t is string => typeof t === "string").slice(0, LIMITS.topics).map((t) => t.trim())
    : [];

  const problems: string[] = [];
  if (!name) problems.push("a name");
  if (!EMAIL_PATTERN.test(email)) problems.push("a valid email address");
  if (message.length < 10) problems.push("a message of at least 10 characters");

  if (problems.length) {
    return res.status(400).json({ ok: false, error: `Please include ${problems.join(", ")}.` });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Configuration, not the sender's problem. Log the specifics, tell them
    // something true and actionable.
    console.error("contact: missing env", {
      RESEND_API_KEY: Boolean(apiKey),
      CONTACT_TO_EMAIL: Boolean(to),
      CONTACT_FROM_EMAIL: Boolean(from),
    });
    return res.status(503).json({ ok: false, error: "The form is not configured yet." });
  }

  const subject = `Portfolio enquiry from ${name}${company ? ` (${company})` : ""}`;
  const lines = [
    `Name:    ${name}`,
    company ? `Company: ${company}` : null,
    `Email:   ${email}`,
    topics.length ? `About:   ${topics.join(", ")}` : null,
    "",
    message,
  ].filter((line): line is string => line !== null);

  const html = `<table role="presentation" style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">
  <tr><td style="padding:2px 12px 2px 0;color:#666">Name</td><td>${escapeHtml(name)}</td></tr>
  ${company ? `<tr><td style="padding:2px 12px 2px 0;color:#666">Company</td><td>${escapeHtml(company)}</td></tr>` : ""}
  <tr><td style="padding:2px 12px 2px 0;color:#666">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  ${topics.length ? `<tr><td style="padding:2px 12px 2px 0;color:#666">About</td><td>${escapeHtml(topics.join(", "))}</td></tr>` : ""}
</table>
<hr style="border:none;border-top:1px solid #e5e5e5;margin:18px 0">
<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div>`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        // So a reply in the mail client goes to the sender, not to ourselves.
        reply_to: email,
        subject,
        text: lines.join("\n"),
        html,
      }),
    });

    if (!response.ok) {
      console.error("contact: resend rejected", response.status, await response.text());
      return res.status(502).json({ ok: false, error: "The message could not be sent." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact: request failed", err);
    return res.status(502).json({ ok: false, error: "The message could not be sent." });
  }
}

function safeParse(raw: string): Payload {
  try {
    return JSON.parse(raw) as Payload;
  } catch {
    return {};
  }
}
