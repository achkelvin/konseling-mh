// Tautan dari email admin: /api/testimonials/moderate?id=…&action=approve|reject&sig=…
export default defineEventHandler(async (event) => {
  const { id, action, sig } = getQuery(event) as Record<string, string>
  const page = (msg: string) => {
    setHeader(event, 'content-type', 'text/html; charset=utf-8')
    return `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<body style="font-family:system-ui;background:#f6f1e7;color:#384538;display:grid;place-items:center;min-height:90vh">
<div style="max-width:420px;text-align:center"><h1 style="font-size:22px">${msg}</h1>
<p><a href="/" style="color:#b5563a">Buka situs Rena Jiwa</a></p></div></body>`
  }
  if (!id || (action !== 'approve' && action !== 'reject') || !verifyModeration(id, action, sig || '')) {
    setResponseStatus(event, 403)
    return page('Tautan tidak valid.')
  }
  const t = await getTestimonial(id)
  if (!t) {
    setResponseStatus(event, 404)
    return page('Testimoni tidak ditemukan.')
  }
  t.status = action === 'approve' ? 'approved' : 'rejected'
  await saveTestimonial(t)
  // kosongkan cache agar beranda langsung berubah
  const cache = useStorage('cache')
  for (const k of await cache.getKeys('nitro:handlers:testimonials')) await cache.removeItem(k)
  return page(action === 'approve' ? 'Testimoni disetujui dan akan tampil di beranda.' : 'Testimoni ditolak dan tidak akan tampil.')
})
