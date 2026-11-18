import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import nodemailer from 'nodemailer'

export interface Mail {
  to: string
  subject: string
  html: string
  replyTo?: string
  /** gambar QR, dirujuk di HTML sebagai <img src="cid:qris"> */
  qrPng?: Buffer
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
    const html = mail.qrPng
      ? mail.html.replace('cid:qris', 'data:image/png;base64,' + mail.qrPng.toString('base64'))
      : mail.html
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
    attachments: mail.qrPng ? [{ filename: 'qris.png', content: mail.qrPng, cid: 'qris' }] : [],
  })
}

// ---- Template ---------------------------------------------------------------

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export const rupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID')

export const tanggal = (date: string) =>
  new Date(date + 'T00:00:00Z').toLocaleDateString('id-ID', {
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

function layout(title: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2a28">
  <h2 style="color:#1e554d">${esc(title)}</h2>${body}
  <p style="font-size:12px;color:#888;margin-top:32px">KonselingMH — email ini dikirim otomatis.</p></div>`
}

/** Email ke admin: seluruh isi formulir. */
export function adminEmail(title: string, rows: [string, unknown][]) {
  return layout(title, table(rows))
}

/** Email ke klien: ringkasan + QR pembayaran. */
export function clientEmail(opts: {
  name: string
  code: string
  total: number
  rows: [string, unknown][]
  demo: boolean
  whatsapp: string
}) {
  return layout(
    `Halo ${opts.name}, pendaftaranmu kami terima`,
    `<p>Kode pendaftaran: <b style="font-size:18px;letter-spacing:2px">${esc(opts.code)}</b></p>
    ${table(opts.rows)}
    <h3 style="margin-top:24px">Pembayaran via QRIS</h3>
    <p>Scan QR berikut dengan m-banking atau e-wallet apa pun. Nominal sudah terisi otomatis:
    <b>${rupiah(opts.total)}</b>.</p>
    ${opts.demo ? '<p style="color:#c00"><b>QR CONTOH — jangan dibayar.</b></p>' : ''}
    <p style="text-align:center"><img src="cid:qris" width="240" height="240" alt="QRIS"></p>
    <p>Setelah membayar, kirim bukti pembayaran beserta kode pendaftaran ke WhatsApp admin
    <b>${esc(opts.whatsapp)}</b>. Jadwal dikonfirmasi setelah pembayaran diverifikasi.</p>`,
  )
}
