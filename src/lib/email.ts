// ── Email templates ────────────────────────────────────────────────────────────
//
// Plain HTML with inline styles only — works in all email clients.
// Accent colour: approximated hex from oklch(55% 0.14 70).

const ACCENT = "#C4922A";
const SITE_URL = "https://albatrostenerife.com";

// ── Translations ───────────────────────────────────────────────────────────────

const i18n: Record<string, {
  subject: string;
  greeting: (name?: string | null) => string;
  body: string;
  contact: string;
  footer: string;
}> = {
  en: {
    subject: "We received your inquiry — Albatros Tenerife",
    greeting: (name) => name ? `Hi ${name},` : "Hello,",
    body: "Thank you for reaching out! We have received your message and will get back to you shortly. We typically reply the same day, including evenings and weekends.",
    contact: "If you have any urgent questions, feel free to contact us directly:",
    footer: "Albatros Tenerife · Park Albatros Resort, Golf del Sur, Tenerife",
  },
  cs: {
    subject: "Přijali jsme váš dotaz — Albatros Tenerife",
    greeting: (name) => name ? `Dobrý den, ${name},` : "Dobrý den,",
    body: "Děkujeme za váš dotaz! Obdrželi jsme vaši zprávu a brzy se vám ozveme. Obvykle odpovídáme ten samý den, i večer a o víkendech.",
    contact: "Pro urgentní dotazy nás kontaktujte přímo:",
    footer: "Albatros Tenerife · Park Albatros Resort, Golf del Sur, Tenerife",
  },
  pl: {
    subject: "Otrzymaliśmy Twoje zapytanie — Albatros Tenerife",
    greeting: (name) => name ? `Witaj, ${name},` : "Witaj,",
    body: "Dziękujemy za kontakt! Otrzymaliśmy Twoją wiadomość i wkrótce się odezwiemy. Zazwyczaj odpowiadamy tego samego dnia, również wieczorami i w weekendy.",
    contact: "W pilnych sprawach skontaktuj się z nami bezpośrednio:",
    footer: "Albatros Tenerife · Park Albatros Resort, Golf del Sur, Tenerife",
  },
  hu: {
    subject: "Megkaptuk megkeresését — Albatros Tenerife",
    greeting: (name) => name ? `Kedves ${name},` : "Kedves Érdeklődő,",
    body: "Köszönjük megkeresését! Megkaptuk üzenetét, és hamarosan felvesszük Önnel a kapcsolatot. Általában ugyanazon a napon válaszolunk, este és hétvégén is.",
    contact: "Sürgős kérdések esetén vegye fel velünk a kapcsolatot közvetlenül:",
    footer: "Albatros Tenerife · Park Albatros Resort, Golf del Sur, Tenerife",
  },
  it: {
    subject: "Abbiamo ricevuto la sua richiesta — Albatros Tenerife",
    greeting: (name) => name ? `Gentile ${name},` : "Gentile Cliente,",
    body: "Grazie per averci contattato! Abbiamo ricevuto il suo messaggio e la contatteremo a breve. Di solito rispondiamo nella stessa giornata, anche la sera e nei fine settimana.",
    contact: "Per domande urgenti, ci contatti direttamente:",
    footer: "Albatros Tenerife · Park Albatros Resort, Golf del Sur, Tenerife",
  },
  es: {
    subject: "Hemos recibido su consulta — Albatros Tenerife",
    greeting: (name) => name ? `Estimado/a ${name},` : "Estimado/a Cliente,",
    body: "¡Gracias por ponerse en contacto con nosotros! Hemos recibido su mensaje y nos pondremos en contacto con usted en breve. Normalmente respondemos el mismo día, incluso por la noche y los fines de semana.",
    contact: "Para preguntas urgentes, contáctenos directamente:",
    footer: "Albatros Tenerife · Park Albatros Resort, Golf del Sur, Tenerife",
  },
};

function getLang(lang: string) {
  return i18n[lang] ?? i18n.en;
}

// ── Client confirmation ────────────────────────────────────────────────────────

export function clientConfirmationEmail(
  lang: string,
  firstName: string | null | undefined,
  contactEmail: string,
  contactPhone: string | null | undefined,
): { subject: string; html: string } {
  const t = getLang(lang);
  const waHref = contactPhone
    ? `https://wa.me/${contactPhone.replace(/\D/g, "")}`
    : null;

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#000000;padding:28px 40px;text-align:center;">
            <a href="${SITE_URL}" style="color:${ACCENT};text-decoration:none;font-size:22px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
              ALBATROS TENERIFE
            </a>
            <p style="color:#ffffff80;margin:6px 0 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;">
              Real Estate · Golf del Sur
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 16px;font-size:16px;color:#111;">${t.greeting(firstName)}</p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#333;">${t.body}</p>

            <!-- Divider -->
            <hr style="border:none;border-top:1px solid #e5e5e5;margin:0 0 24px;">

            <p style="margin:0 0 16px;font-size:14px;color:#555;">${t.contact}</p>

            <!-- Contact buttons -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                ${waHref ? `
                <td style="padding-right:12px;">
                  <a href="${waHref}" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;font-size:14px;font-family:Arial,sans-serif;padding:10px 20px;border-radius:6px;">
                    WhatsApp
                  </a>
                </td>` : ""}
                <td>
                  <a href="mailto:${contactEmail}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:14px;font-family:Arial,sans-serif;padding:10px 20px;border-radius:6px;">
                    ${contactEmail}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #e5e5e5;text-align:center;">
            <p style="margin:0;font-size:12px;color:#999;font-family:Arial,sans-serif;">${t.footer}</p>
            <p style="margin:8px 0 0;">
              <a href="${SITE_URL}" style="font-size:12px;color:${ACCENT};font-family:Arial,sans-serif;">${SITE_URL}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject: t.subject, html };
}

// ── Admin notification ─────────────────────────────────────────────────────────

export function adminNotificationEmail(data: {
  firstName?: string | null;
  aptNo?: string | null;
  email: string;
  phone?: string | null;
  message?: string | null;
  lang: string;
  source: string;
}): { subject: string; html: string } {
  const { firstName, aptNo, email, phone, message, lang, source } = data;

  const rows = [
    firstName ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;width:100px;font-family:Arial,sans-serif;">Name</td><td style="padding:8px 0;font-size:14px;color:#111;font-family:Arial,sans-serif;">${firstName}</td></tr>` : "",
    aptNo     ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;font-family:Arial,sans-serif;">Apt. No.</td><td style="padding:8px 0;font-size:14px;color:#111;font-family:Arial,sans-serif;">${aptNo}</td></tr>` : "",
    `<tr><td style="padding:8px 0;color:#666;font-size:14px;font-family:Arial,sans-serif;">Email</td><td style="padding:8px 0;font-size:14px;font-family:Arial,sans-serif;"><a href="mailto:${email}" style="color:${ACCENT};">${email}</a></td></tr>`,
    phone     ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;font-family:Arial,sans-serif;">Phone</td><td style="padding:8px 0;font-size:14px;color:#111;font-family:Arial,sans-serif;"><a href="tel:${phone}" style="color:${ACCENT};">${phone}</a></td></tr>` : "",
    message   ? `<tr><td colspan="2" style="padding:16px 0 0;font-family:Arial,sans-serif;"><p style="margin:0 0 8px;color:#666;font-size:14px;">Message</p><p style="margin:0;font-size:14px;color:#111;line-height:1.6;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p></td></tr>` : "",
  ].filter(Boolean).join("\n");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#000000;padding:20px 32px;">
            <p style="margin:0;color:${ACCENT};font-size:11px;letter-spacing:2px;text-transform:uppercase;">New inquiry</p>
            <p style="margin:4px 0 0;color:#ffffff;font-size:18px;font-weight:bold;">Albatros Tenerife</p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              ${rows}
            </table>
          </td>
        </tr>

        <!-- Meta -->
        <tr>
          <td style="background:#f9f9f9;padding:16px 32px;border-top:1px solid #e5e5e5;">
            <p style="margin:0;font-size:11px;color:#aaa;">Language: ${lang} &nbsp;·&nbsp; Source: ${source}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject: `New inquiry from ${firstName ?? email}`, html };
}
