export interface SmsResult {
  success: boolean;
  skipped?: boolean;
  error?: string;
}

export async function sendOwnerSms(message: string): Promise<SmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const to = process.env.NOTIFICATION_PHONE;

  if (!accountSid || !authToken || !from || !to) {
    return { success: false, skipped: true };
  }

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const body = new URLSearchParams({ To: to, From: from, Body: message });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[SMS] Twilio error:", err);
      return { success: false, error: "Échec envoi SMS" };
    }

    console.log("[SMS] Notification envoyée");
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erreur SMS";
    console.error("[SMS]", msg);
    return { success: false, error: msg };
  }
}
