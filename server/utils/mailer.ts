import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import nodemailer from 'nodemailer'

export interface Mail {
  to: string
  subject: string
  html: string
  replyTo?: string
}

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  const { smtp } = useRuntimeConfig()
  if (!smtp.host) return null
  transporter ??= nodemailer.createTransport({
    host: smtp.host,
    port: Number(smtp.port) || 587,
    secure: Number(smtp.port) === 465,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
  })
  return transporter
}

/**
 * Mengirim email lewat SMTP. Jika SMTP belum diatur (mode pengembangan),
 * email disimpan sebagai file HTML di folder `.outbox/` agar bisa dicek.
 */
export async function sendMail(mail: Mail) {
  const t = getTransporter()
  if (!t) {
    const dir = join(process.cwd(), '.outbox')
    await mkdir(dir, { recursive: true })
    const html = mail.html
    const file = join(dir, `${Date.now()}-${mail.to.replace(/[^a-z0-9]/gi, '_')}.html`)
    await writeFile(file, `<!-- To: ${mail.to} | Subject: ${mail.subject} -->\n${html}`)
    console.info(`[mail] SMTP belum diatur, email disimpan ke ${file}`)
    return
  }
  await t.sendMail({
    from: useRuntimeConfig().smtp.from || useRuntimeConfig().smtp.user,
    to: mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    html: mail.html,
  })
}

// ---- Template ---------------------------------------------------------------

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export const rupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID')

export const tanggal = (date: string, lang: Lang = 'id') =>
  new Date(date + 'T00:00:00Z').toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })

function table(rows: [string, unknown][]) {
  return `<table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:14px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="border-bottom:1px solid #eee;color:#666;width:35%;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join('')}</table>`
}

function layout(title: string, body: string, lang: Lang = 'id') {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2a28">
  <h2 style="color:#1e554d">${esc(title)}</h2>${body}
  <p style="font-size:12px;color:#888;margin-top:32px">${MAIL[lang].footer}</p></div>`
}

/** Teks email ke klien dalam dua bahasa. Email ke admin selalu bahasa Indonesia. */
const MAIL = {
  id: {
    footer: 'Rena Jiwa — email ini dikirim otomatis.',
    hello: (n: string) => `Halo ${n}, pendaftaranmu kami terima`,
    code: 'Kode pendaftaran',
    payTitle: 'Pembayaran',
    paidOnline: 'Pembayaran PayPal diproses di Cal.com. Admin akan mengonfirmasi jadwalmu setelah pembayaran diterima.',
    adminSends: (a: string, wa: string) =>
      `Total yang perlu dibayar: <b>${a}</b>. Admin akan mengirim detail pembayaran (QRIS atau transfer bank; PayPal untuk luar negeri) lewat WhatsApp atau email, paling lambat 2 jam di jam kerja. Ada pertanyaan? Hubungi admin di WhatsApp <b>${wa}</b>.`,
    reschedule: 'Ganti jadwal gratis jika lebih dari 24 jam sebelum sesi. Kurang dari itu: biaya admin Rp50.000 atau sesi hangus. Layanan ini bukan layanan gawat darurat.',
    payLead: (a: string) => `Silakan transfer <b>${a}</b> ke rekening berikut:`,
    bank: 'Bank', account: 'No. rekening', holder: 'Atas nama', amount: 'Jumlah', reference: 'Berita transfer',
    after: (wa: string) =>
      `Setelah transfer, kirim bukti pembayaran beserta kode pendaftaran ke WhatsApp admin <b>${wa}</b>. Jadwal dikonfirmasi setelah pembayaran diverifikasi.`,
  },
  en: {
    footer: 'Rena Jiwa — this email was sent automatically.',
    hello: (n: string) => `Hi ${n}, we've received your registration`,
    code: 'Registration code',
    payTitle: 'Payment',
    paidOnline: 'Your PayPal payment is handled in Cal.com. The admin will confirm your session once the payment is received.',
    adminSends: (a: string, wa: string) =>
      `Amount due: <b>${a}</b>. The admin will send the payment details (QRIS or bank transfer; PayPal from abroad) via WhatsApp or email, within 2 hours during working hours. Questions? Contact the admin on WhatsApp <b>${wa}</b>.`,
    reschedule: 'Rescheduling is free more than 24 hours before the session. Within 24 hours: a Rp50,000 admin fee or the session is forfeited. This is not an emergency service.',
    payLead: (a: string) => `Please transfer <b>${a}</b> to the following account:`,
    bank: 'Bank', account: 'Account no.', holder: 'Account name', amount: 'Amount', reference: 'Transfer note',
    after: (wa: string) =>
      `After transferring, send the receipt with your registration code to the admin on WhatsApp <b>${wa}</b>. Your session is confirmed once the payment is verified.`,
  },
}

/** Email ke admin: seluruh isi formulir. */
export function adminEmail(title: string, rows: [string, unknown][]) {
  return layout(title, table(rows))
}

/** Email ke klien: ringkasan + instruksi transfer. */
export function clientEmail(opts: {
  name: string
  code: string
  total: number
  rows: [string, unknown][]
  bank: { name: string; account: string; holder: string }
  whatsapp: string
  lang: Lang
  paidOnline?: boolean
}) {
  const t = MAIL[opts.lang]
  // Brief: nomor rekening/QRIS/PayPal tidak ditampilkan di website; admin mengirimnya.
  const payment = opts.paidOnline
    ? `<p>${t.paidOnline}</p>`
    : SITE.featureFlags.showPaymentDetails
    ? `<p>${t.payLead(rupiah(opts.total))}</p>
    ${table([
      [t.bank, opts.bank.name],
      [t.account, opts.bank.account],
      [t.holder, opts.bank.holder],
      [t.amount, rupiah(opts.total)],
      [t.reference, opts.code],
    ])}
    <p>${t.after(esc(opts.whatsapp))}</p>`
    : `<p>${t.adminSends(rupiah(opts.total), esc(opts.whatsapp))}</p>`
  return layout(
    t.hello(opts.name),
    `<p>${t.code}: <b style="font-size:18px;letter-spacing:2px">${esc(opts.code)}</b></p>
    ${table(opts.rows)}
    <h3 style="margin-top:24px">${t.payTitle}</h3>
    ${payment}
    <p style="font-size:13px;color:#666">${t.reschedule}</p>`,
    opts.lang,
  )
}
