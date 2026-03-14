/**
 * Sends a login notification email when user signs in with Google, GitHub, or LinkedIn.
 * Uses EmailJS (https://www.emailjs.com/) - add these to your .env:
 *   VITE_EMAILJS_SERVICE_ID
 *   VITE_EMAILJS_TEMPLATE_ID
 *   VITE_EMAILJS_PUBLIC_KEY
 * Your EmailJS template can use: {{to_email}}, {{login_provider}}, {{login_time}}
 */
export async function sendLoginNotification(email, provider) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) return

  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          to_email: email,
          login_provider: provider,
          login_time: new Date().toLocaleString(),
        },
      }),
    })
  } catch (_) {
    // Fire-and-forget; don't block login or show errors to user
  }
}
