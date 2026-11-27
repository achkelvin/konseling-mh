// Menerima testimoni dari halaman /testimoni. Disimpan sebagai "pending";
// admin menerima email berisi tautan Setujui / Tolak (moderasi wajib sebelum tampil).
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  // jebakan bot: kolom tersembunyi harus kosong
  if (body?.website) return { ok: true }

  const lang = body?.lang === 'en' ? 'en' : 'id'
  const quote = String(body?.quote ?? '').trim()
  const name = String(body?.name ?? '').trim().slice(0, 40)
  const email = String(body?.email ?? '').trim().slice(0, 120)
  const service = serviceById(body?.service)?.name
  const err = (id: string, en: string) => createError({ statusCode: 400, statusMessage: lang === 'en' ? en : id })

  if (quote.length < 20) throw err('Ceritamu minimal 20 karakter.', 'Please write at least 20 characters.')
  if (quote.length > 600) throw err('Ceritamu maksimal 600 karakter.', 'Please keep it under 600 characters.')
  if (body?.consent !== true) throw err('Mohon centang persetujuan.', 'Please tick the consent box.')
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw err('Format email tidak valid.', 'Invalid email address.')

  const t: StoredTestimonial = {
    id: newTestimonialId(),
    quote,
    name: name || (lang === 'en' ? 'Rena Jiwa client' : 'Klien Rena Jiwa'),
    service,
    email: email || undefined,
    consent: true,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  try {
    await saveTestimonial(t)
  } catch (e) {
    console.error('[testimonials] gagal menyimpan:', e)
    throw createError({
      statusCode: 503,
      statusMessage: lang === 'en' ? 'Could not save right now. Please try again later.' : 'Belum bisa menyimpan. Coba lagi nanti.',
    })
  }

  // email moderasi ke admin
  const base = process.env.VERCEL ? SITE.brand.siteUrl : getRequestURL(event).origin
  const link = (action: 'approve' | 'reject') =>
    `${base}/api/testimonials/moderate?id=${t.id}&action=${action}&sig=${signModeration(t.id, action)}`
  const title = 'Testimoni baru menunggu persetujuan'
  const links = `<p style="margin:24px 0 8px;text-align:center">
    <a href="${link('approve')}" style="background:#384538;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Setujui &amp; tampilkan</a>
    &nbsp; <a href="${link('reject')}" style="color:#b5563a">Tolak</a></p>
    <p style="font-size:12px;color:#777;text-align:center">Testimoni hanya tampil di situs setelah disetujui.</p>`
  const html = adminEmail(title, [
    ['Nama tampilan', t.name],
    ['Layanan', t.service || '-'],
    ['Email (tidak ditampilkan)', t.email || '-'],
    ['Testimoni', t.quote],
  ])
  try {
    await sendMail({
      to: useRuntimeConfig().adminEmail,
      replyTo: t.email,
      subject: `[Rena Jiwa] ${title}`,
      html: html.includes('</body>') ? html.replace('</body>', `${links}</body>`) : html + links,
    })
  } catch (e) {
    console.error('[testimonials] email moderasi gagal:', e)
  }
  return { ok: true }
})
