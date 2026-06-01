import { Resend } from 'resend'
import { formatRp } from './utils'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmation(data: {
  to: string
  date: string
  time: string
  services: { name: string; price: number }[]
}) {
  if (!process.env.RESEND_API_KEY) return

  const total = data.services.reduce((s, p) => s + p.price, 0)
  const serviceList = data.services
    .map((s) => `<li style="padding:4px 0;">${s.name} — <b>${formatRp(s.price)}</b></li>`)
    .join('')

  await resend.emails.send({
    from: 'FI Barbershop <onboarding@resend.dev>',
    to: data.to,
    subject: `✅ Booking Dikonfirmasi — ${data.date} pukul ${data.time}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#161618;color:#ece8e1;padding:32px;border-radius:12px;">
        <h1 style="font-size:24px;margin:0 0 8px;color:#c9a24b;">✂ FI Barbershop</h1>
        <p style="margin:0 0 24px;color:#9c958b;font-size:14px;">Sharp · Clean · Classic</p>

        <div style="background:#212124;border-radius:8px;padding:20px;margin-bottom:20px;">
          <p style="margin:0 0 4px;font-size:13px;color:#9c958b;text-transform:uppercase;letter-spacing:.06em;">Detail Booking</p>
          <p style="margin:0;font-size:20px;font-weight:700;">📅 ${data.date} · 🕒 ${data.time}</p>
        </div>

        <div style="background:#212124;border-radius:8px;padding:20px;margin-bottom:20px;">
          <p style="margin:0 0 12px;font-size:13px;color:#9c958b;text-transform:uppercase;letter-spacing:.06em;">Layanan</p>
          <ul style="margin:0;padding:0 0 0 16px;color:#ece8e1;">${serviceList}</ul>
          <hr style="border:none;border-top:1px solid #2a2a2e;margin:16px 0;">
          <p style="margin:0;font-size:16px;"><b>Total: ${formatRp(total)}</b></p>
        </div>

        <div style="background:rgba(201,162,75,0.1);border:1px dashed rgba(201,162,75,0.4);border-radius:8px;padding:16px;font-size:13px;color:#9c958b;">
          ✓ Pesanan Anda sedang <b style="color:#ece8e1;">menunggu konfirmasi</b> dari admin. Datanglah tepat waktu!
        </div>
      </div>
    `,
  })
}
