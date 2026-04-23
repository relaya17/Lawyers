/**
 * שליחת OTP — בפרודקשן: חברו Resend / SendGrid.
 * בלי מפתח: לוג לקונסול (פיתוח בלבד).
 */
export async function sendEmailOtp(to: string, code: string): Promise<void> {
  const from = process.env.AUTH_EMAIL_FROM?.trim() || 'LexStudy <onboarding@resend.dev>';
  const key = process.env.RESEND_API_KEY?.trim();

  if (key) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'קוד אימות LexStudy',
        html: `<p>קוד האימות שלך:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</p><p>הקוד תקף ל־15 דקות.</p>`,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Email send failed: ${res.status} ${t.slice(0, 200)}`);
    }
    return;
  }

  console.info(`[auth][otp] (dev) to=${to} code=${code}`);
}

/** אישור הרשמה לרשימת המתנה — דף נחיתה */
export async function sendWaitlistConfirmation(to: string): Promise<void> {
  const from = process.env.AUTH_EMAIL_FROM?.trim() || 'LexStudy <onboarding@resend.dev>';
  const key = process.env.RESEND_API_KEY?.trim();

  if (key) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'נרשמת לרשימת ההמתנה — LexStudy',
        html: `<p>שלום,</p>
<p>תודה שנרשמת ל-LexStudy. נעדכן אותך כשהגרסה הבאה תהיה זמינה.</p>
<p style="color:#666;font-size:14px">צוות LexStudy</p>`,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Waitlist email failed: ${res.status} ${t.slice(0, 200)}`);
    }
    return;
  }

  console.info(`[marketing][waitlist] (dev) confirmation to=${to}`);
}
