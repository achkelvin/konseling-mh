// Data situs Rena Jiwa, mengikuti contents/RenaJiwa_Brief_Website.md (bagian 12).
// Dipakai bersama oleh server (harga, jadwal) dan halaman (tampilan).
// Ubah nilai di sini untuk mengganti harga, diskon, kontak, atau menyalakan fitur.

export type ServiceId = 'chat' | 'voice' | 'video' | 'offline' | 'mhcu'
export type DiscountId = 'none' | 'student' | 'diaspora'

export interface SiteService {
  id: ServiceId
  name: string
  minutes: number
  priceIDR: number
  /** bisa dipesan langsung lewat situs */
  bookable: boolean
  discountable: boolean
}

export interface Testimonial {
  quote: string
  name: string
  service?: string
  /** wajib true; testimoni tanpa persetujuan tidak ditampilkan */
  consent: boolean
}

export const SITE = {
  brand: {
    name: 'Rena Jiwa',
    tagline: 'Awal baru dimulai dari bercerita',
    instagram: '@rena.jiwa',
    email: 'renajiwa@gmail.com',
  },
  contact: {
    whatsappDisplay: '+62 857-9373-1917',
    whatsapp: '6285793731917',
  },
  featureFlags: {
    /** menu "Pilih Psikolog/Helper" dan jadwal per psikolog — nyalakan saat ada psikolog mitra */
    showPsychologistPicker: false,
    /** bagian "Cerita dari mereka" — nyalakan setelah konfirmasi etik dan ada isi */
    showTestimonials: false,
    /** layanan Offline (Jakarta). false = sembunyikan baris, FAQ, dan tombol "Tanya admin" */
    offlineEnabled: true,
    /**
     * Tampilkan nomor rekening di halaman sukses dan email klien.
     * Brief: detail pembayaran TIDAK ditaruh di website (admin mengirim lewat WhatsApp/email).
     */
    showPaymentDetails: true,
  },
  services: [
    { id: 'chat', name: 'Chat', minutes: 60, priceIDR: 75000, bookable: true, discountable: true },
    { id: 'voice', name: 'Voice Call', minutes: 60, priceIDR: 120000, bookable: true, discountable: true },
    { id: 'video', name: 'Video Call', minutes: 60, priceIDR: 150000, bookable: true, discountable: true },
    { id: 'offline', name: 'Offline (Jakarta)', minutes: 60, priceIDR: 180000, bookable: false, discountable: false },
    { id: 'mhcu', name: 'MHCU + konsul hasil', minutes: 30, priceIDR: 200000, bookable: true, discountable: false },
  ] as SiteService[],
  discounts: [
    { id: 'student', name: 'Pelajar/Mahasiswa', value: 0.1 },
    { id: 'diaspora', name: 'Diaspora', value: 0.1 },
  ] as { id: Exclude<DiscountId, 'none'>; name: string; value: number }[],
  /** Tanggal berakhir promo (YYYY-MM-DD). null = promo berjalan, tanggal belum ditetapkan. */
  promoEndsAt: null as string | null,
  /** Isi lewat file ini, bukan di halaman. Hanya yang consent: true yang tampil. */
  testimonials: [] as Testimonial[],
  psychologist: {
    id: 'nadiah',
    name: 'Nadiah Cahyani, S.Psi., M.Psi., Psikolog',
    strpk: 'XY00001618097195',
    sipp: '20240070-2024-01-3924',
    verifyUrl: 'https://v.ipkindonesia.or.id',
  },
  /** Jam layanan online (Asia/Jakarta). */
  availability: {
    weekday: { from: '17:00', to: '21:00' },
    weekend: { from: '09:00', to: '21:00' },
    /** jeda setelah sesi (menit) */
    bufferMinutes: 15,
    /** pemesanan minimal sekian jam sebelumnya */
    minNoticeHours: 12,
    /** jendela pemesanan (hari ke depan) */
    windowDays: 30,
  },
  /** Ganti jadwal gratis jika lebih dari sekian jam sebelum sesi; biaya admin jika kurang. */
  reschedule: { freeHours: 24, feeIDR: 50000 },
  /**
   * Cal.com (brief bagian 8). Isi `username` untuk menyalakan: jadwal di formulir pemesanan
   * diganti kalender Cal.com. Kosong = situs memakai pemilih jadwal bawaan.
   * Buat event type di Cal.com dengan slug di bawah (atau ganti slug-nya di sini).
   */
  cal: {
    /** asal embed Cal.com; skrip dimuat dari `${origin}/embed/embed.js` */
    origin: 'https://app.cal.com',
    /** contoh: 'renajiwa' untuk cal.com/renajiwa */
    username: '',
    /** event untuk klien di Indonesia (bayar QRIS/transfer, admin konfirmasi) */
    events: {
      chat: 'chat-60',
      voice: 'voice-call-60',
      video: 'video-call-60',
      mhcu: 'mhcu-hasil-30',
    } as Partial<Record<ServiceId, string>>,
    /**
     * Event untuk klien di luar negeri, dengan pembayaran PayPal yang dihubungkan
     * pemilik di Cal.com (Settings → Apps → PayPal, lalu aktifkan di event).
     * Kosongkan bila belum ada; klien luar negeri lalu memakai event biasa.
     */
    intlEvents: {
      chat: 'chat-60-intl',
      voice: 'voice-call-60-intl',
      video: 'video-call-60-intl',
      mhcu: 'mhcu-hasil-30-intl',
    } as Partial<Record<ServiceId, string>>,
  },
  /** Vercel Analytics: tanpa cookie, hanya aktif saat situs berjalan di Vercel (produksi). */
  analytics: { vercel: true },
  emergency: [
    { country: 'Indonesia', countryEn: 'Indonesia', number: '119' },
    { country: 'Türkiye', countryEn: 'Türkiye', number: '112' },
    { country: 'Uni Eropa', countryEn: 'European Union', number: '112' },
    { country: 'Amerika Serikat', countryEn: 'United States', number: '988' },
    { country: 'Inggris', countryEn: 'United Kingdom', number: 'Samaritans 116 123' },
    { country: 'Australia', countryEn: 'Australia', number: 'Lifeline 13 11 14' },
  ],
}

/** Layanan yang tampil (Offline disembunyikan bila flag mati). */
export const visibleServices = () =>
  SITE.services.filter((s) => s.id !== 'offline' || SITE.featureFlags.offlineEnabled)

export const serviceById = (id: unknown) => SITE.services.find((s) => s.id === id)

/** Promo masih berlaku pada tanggal `today` (YYYY-MM-DD)? */
export function promoActive(today = new Date().toISOString().slice(0, 10)) {
  return SITE.promoEndsAt === null || today <= SITE.promoEndsAt
}

/**
 * Harga akhir sebuah layanan. Diskon hanya untuk layanan yang bisa didiskon,
 * selama promo, satu diskon per sesi. Diskon pelajar tidak berlaku bila
 * klien di bawah 18 tahun (didaftarkan orang tua/wali).
 */
export function priceFor(serviceId: ServiceId, discount: DiscountId = 'none', isMinor = false) {
  const s = serviceById(serviceId)
  if (!s) return { base: 0, total: 0, discountApplied: null as null | DiscountId }
  const d = SITE.discounts.find((x) => x.id === discount)
  const eligible = !!d && s.discountable && promoActive() && !(discount === 'student' && isMinor)
  const total = eligible ? Math.round(s.priceIDR * (1 - d!.value)) : s.priceIDR
  return { base: s.priceIDR, total, discountApplied: eligible ? discount : null }
}

/** Cal.com aktif bila username sudah diisi. */
export const calEnabled = () => SITE.cal.username.trim().length > 0

/** Klien di luar Indonesia memakai event PayPal (bila disiapkan). */
export const isAbroad = (country: string) => !/^\s*(indonesia|id|ri)\s*$/i.test(country || 'Indonesia')

/** Tautan Cal.com untuk layanan, mis. "renajiwa/chat-60". null bila tidak tersedia. */
export function calLinkFor(serviceId: ServiceId, abroad = false) {
  if (!calEnabled()) return null
  const slug = (abroad && SITE.cal.intlEvents[serviceId]) || SITE.cal.events[serviceId]
  return slug ? `${SITE.cal.username.trim()}/${slug}` : null
}

/** Tautan WhatsApp admin dengan pesan terisi. */
export const waLink = (text: string) => `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(text)}`
