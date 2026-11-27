// Testimoni yang tampil di beranda: kiriman formulir /testimoni yang sudah disetujui admin,
// ditambah isi SITE.testimonials. Disimpan di cache 5 menit.
export default defineCachedEventHandler(
  async () => {
    if (!SITE.featureFlags.showTestimonials) return []
    const local = SITE.testimonials.filter((t) => t.consent === true)
    try {
      const approved = (await allTestimonials())
        .filter((t) => t.status === 'approved' && t.consent === true)
        .map(({ quote, name, service }) => ({ quote, name, service, consent: true }))
      return [...approved, ...local]
    } catch (e) {
      console.warn('[testimonials] gagal membaca penyimpanan:', (e as Error).message)
      return local
    }
  },
  { maxAge: 300, swr: true, name: 'testimonials', getKey: () => 'approved' },
)
