 
export async function sendSms() {
  const res = await fetch('https://raselsms.com/api/v2/messages/send', {
    method: "POST",
    headers: {
      "X-API-Key": "b369f1ff1f572d71d483a397301c1849b50463eb254ac02de11e6845e766b4f7",
      "Content-Type": "application/json",
        "Idempotency-Key": "otp-login-user-42-attempt-1",
    },
    body: JSON.stringify({
      to:"+963954092863",                       // e.g. "+963912345678"
      channel: "local_sms",
      messageType:"otp",
     content:{"otpCode":"482193"}
      }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}




