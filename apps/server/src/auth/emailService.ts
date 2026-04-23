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
