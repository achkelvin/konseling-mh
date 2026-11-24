/**
 * Mengirim dua email untuk setiap pendaftaran:
 * 1. ke admin — seluruh isi formulir (inilah "database" untuk alur sederhana ini)
 * 2. ke klien — ringkasan, jadwal, dan instruksi transfer
 * Mengembalikan false jika pengiriman gagal; pendaftaran tetap tercatat.
 */
export async function notify(opts: {
  code: string
  person: Person
  total: number
  adminSubject: string
  adminRows: [string, unknown][]
  clientSubject: string
  clientRows: [string, unknown][]
  lang: Lang
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
        name: opts.person.nickname || opts.person.fullName,
        code: opts.code,
        total: opts.total,
        rows: opts.clientRows,
        bank: config.public.bank,
        whatsapp: config.public.whatsappNumber,
        lang: opts.lang,
      }),
    })
    return true
  } catch (e) {
    console.error(`[mail] gagal mengirim email untuk ${opts.code}:`, e)
    return false
  }
}

/** Membersihkan objek data diri dari body permintaan menjadi Person yang rapi. */
export function cleanPerson(p: any): Person {
  const base = emptyPerson()
  for (const k of Object.keys(base) as (keyof Person)[]) base[k] = typeof p?.[k] === 'string' ? p[k].trim() : ''
  return base
}
