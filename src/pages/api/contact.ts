export const prerender = false;

import { z } from "zod";
import { Resend } from "resend";
import { createClient } from "@sanity/client";

// ── Zod schema ────────────────────────────────────────────────────────────────

const ContactSchema = z.object({
  firstName: z.string().max(100).optional(),
  aptNo:     z.string().max(20).optional(),
  email:     z.email(),
  phone:     z.string().max(50).optional(),
  message:   z.string().max(3000).optional(),
  lang:      z.string(),
  source:    z.string(),
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

  const { firstName, aptNo, email, phone, message, lang, source } = parsed.data;

  // ── Save to Sanity ────────────────────────────────────────────────────────
  const writeToken = import.meta.env.SANITY_API_WRITE_TOKEN;
  if (writeToken) {
    try {
      const sanity = createClient({
        projectId: "nr9v3mei",
        dataset: "production",
        apiVersion: "2026-04-10",
        token: writeToken,
        useCdn: false,
      });
      await sanity.create({
        _type: "contactSubmission",
        firstName,
        aptNo: aptNo || null,
        email,
        phone: phone || null,
        message: message || null,
        lang,
        source,
        submittedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Sanity write failed:", err);
      // Don't block the response — email is the fallback
    }
  }

  // ── Send email via Resend ─────────────────────────────────────────────────
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const from = import.meta.env.RESEND_FROM || "noreply@albatrostenerife.com";
      const to   = import.meta.env.RESEND_TO   || "info@albatrostenerife.com";
      await resend.emails.send({
        from,
        to,
        subject: `New inquiry from ${firstName ?? email}`,
        html: `
          <h2>New contact form submission</h2>
          ${firstName ? `<p><strong>Name:</strong> ${firstName}</p>` : ""}
          ${aptNo ? `<p><strong>Apt. No.:</strong> ${aptNo}</p>` : ""}
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>` : ""}
          <hr>
          <p style="color:#888;font-size:12px">Language: ${lang} · Source: ${source}</p>
        `,
      });
    } catch (err) {
      console.error("Resend failed:", err);
      // Still succeed — data is in Sanity
    }
  }

  return Response.json({ ok: true });
};
