export const prerender = false;

import { z } from "zod";
import { Resend } from "resend";
import { createClient } from "@sanity/client";
import { adminNotificationEmail, clientConfirmationEmail } from "@lib/email";

// ── Zod schema ────────────────────────────────────────────────────────────────

const ContactSchema = z.object({
  firstName:  z.string().max(100).optional(),
  aptNo:      z.string().max(20).optional(),
  email:      z.email(),
  phone:      z.string().max(50).optional(),
  message:    z.string().max(3000).optional(),
  lang:       z.string(),
  source:     z.string().optional(),
  sourceName: z.string().optional(),
});

// ── POST handler ──────────────────────────────────────────────────────────────

export const POST = async ({ request }: { request: Request }) => {
  const fail = (msg: string, status = 400) =>
    Response.json({ ok: false, error: msg }, { status });

  // ── Parse form data ──────────────────────────────────────────────────────
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return fail("Invalid request");
  }

  // ── Honeypot ─────────────────────────────────────────────────────────────
  if (data.get("_trap")) {
    return Response.json({ ok: true }); // silently succeed for bots
  }

  // ── Turnstile ─────────────────────────────────────────────────────────────
  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = data.get("cf-turnstile-response");
    if (!token) return fail("Captcha required");

    const check = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: turnstileSecret, response: token }),
      }
    );
    const { success } = (await check.json()) as { success: boolean };
    if (!success) return fail("Captcha verification failed");
  }

  // ── Validate fields ───────────────────────────────────────────────────────
  const parsed = ContactSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(", ");
    return fail(msg);
  }

  const { firstName, aptNo, email, phone, message, lang, source, sourceName } = parsed.data;

  // ── Send email via Resend ─────────────────────────────────────────────────
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const from    = import.meta.env.RESEND_FROM || "info@albatrostenerife.com";
      const to      = import.meta.env.RESEND_TO   || "info@albatrostenerife.com";
      const toEmail = import.meta.env.RESEND_TO   || "info@albatrostenerife.com";

      // Fetch contact phone for the confirmation email
      let contactPhone: string | null = null;
      try {
        const sanityRead = createClient({
          projectId: "nr9v3mei",
          dataset: "production",
          apiVersion: "2026-04-10",
          useCdn: true,
        });
        contactPhone = await sanityRead.fetch<string | null>(
          `*[_type == "contactInfo"][0].phone`
        );
      } catch { /* non-critical */ }

      const admin = adminNotificationEmail({ firstName, aptNo, email, phone, message, lang, source, sourceName });
      const confirmation = clientConfirmationEmail(lang, firstName, toEmail, contactPhone);

      await Promise.all([
        // Notification to Ivan — reply-to goes directly to client
        resend.emails.send({ from, to, replyTo: email, subject: admin.subject, html: admin.html, text: admin.text }),
        // Confirmation to client
        resend.emails.send({ from, to: email, replyTo: to, subject: confirmation.subject, html: confirmation.html, text: confirmation.text }),
      ]);
    } catch (err) {
      console.error("Resend failed:", err);
      // Still succeed — data is in Sanity
    }
  }

  return Response.json({ ok: true });
};
