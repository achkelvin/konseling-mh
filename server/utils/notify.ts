/**
 * Mengirim dua email untuk setiap pendaftaran:
 * 1. ke admin — seluruh isi formulir (inilah "database" untuk alur sederhana ini)
 * 2. ke klien — ringkasan, jadwal, dan QR pembayaran
 * Mengembalikan false jika pengiriman gagal; pendaftaran tetap tercatat.
 */
export async function notify(opts: {
  code: string
  person: { name: string; email: string }
  total: number
  qr: { png: Buffer; demo: boolean }
  adminSubject: string
  adminRows: [string, unknown][]
  clientSubject: string
  clientRows: [string, unknown][]
}) {
  const config = useRuntimeConfig()
  try {
    await sendMail({
      to: config.adminEmail || 'admin@localhost',
      replyTo: opts.person.email,
      subject: opts.adminSubject,
      html: adminEmail(opts.adminSubject, opts.adminRows),
    })
    await sendMail({
      to: opts.person.email,
      subject: opts.clientSubject,
      html: clientEmail({
        name: opts.person.name,
        code: opts.code,
        total: opts.total,
        rows: opts.clientRows,
        demo: opts.qr.demo,
        whatsapp: config.public.whatsappNumber,
      }),
      qrPng: opts.qr.png,
    })
    return true
  } catch (e) {
    console.error(`[mail] gagal mengirim email untuk ${opts.code}:`, e)
    return false
  }
}
