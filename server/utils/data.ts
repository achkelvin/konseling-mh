// Data contoh (mock). Ganti dengan database sungguhan saat produksi.

export type HelperType = 'psikolog' | 'peer' | 'keluarga'
export type Method = 'chat' | 'call' | 'video'

export interface ServiceType {
  id: HelperType
  label: string
  description: string
  points: string[]
  durationMinutes: number
  priceFrom: number
}

export interface HelperOption {
  id: string
  method: Method
  label: string
  price: number
  durationMinutes: number
}

export interface Helper {
  id: string
  name: string
  gender: 'L' | 'P'
  type: HelperType
  title: string
  license?: string
  description: string
  rating: number
  ratingCount: number
  options: HelperOption[]
  /** hari kerja (0 = Minggu) dan jam mulai sesi, WIB */
  days: number[]
  hours: number[]
}

export const services: ServiceType[] = [
  {
    id: 'psikolog',
    label: 'Psikolog',
    description:
      'Psikolog profesional berizin praktik untuk asesmen dan psikoterapi pada kasus sedang hingga berat.',
    points: ['Ditangani profesional berizin', 'Konseling dan psikoterapi mendalam'],
    durationMinutes: 60,
    priceFrom: 190000,
  },
  {
    id: 'peer',
    label: 'Peer-Counselor',
    description:
      'Lulusan psikologi terlatih yang disupervisi psikolog. Cocok untuk bercerita dan masalah sehari-hari.',
    points: ['Teman bercerita yang terlatih', 'Untuk keluhan ringan dan sehari-hari'],
    durationMinutes: 60,
    priceFrom: 65000,
  },
  {
    id: 'keluarga',
    label: 'Konselor Keluarga',
    description:
      'Pendampingan untuk pasangan dan keluarga: komunikasi, konflik rumah tangga, pranikah, dan pengasuhan.',
    points: ['Sesi individu atau berpasangan', 'Fokus pada relasi dan pengasuhan'],
    durationMinutes: 75,
    priceFrom: 150000,
  },
]

const METHOD_LABEL: Record<Method, string> = {
  chat: 'Chat',
  call: 'Telepon',
  video: 'Video call',
}

function options(id: string, base: number, minutes: number): HelperOption[] {
  const add: Record<Method, number> = { chat: 0, call: 15000, video: 30000 }
  return (Object.keys(add) as Method[]).map((method) => ({
    id: `${id}-${method}`,
    method,
    label: METHOD_LABEL[method],
    price: base + add[method],
    durationMinutes: minutes,
  }))
}

type Seed = Omit<Helper, 'options'> & { base: number; minutes: number }

const seeds: Seed[] = [
  {
    id: 'h-ratna',
    name: 'Ratna Paramita, M.Psi., Psikolog',
    gender: 'P',
    type: 'psikolog',
    title: 'Psikolog Klinis',
    license: 'SIPP: 0000-00-0-1 (contoh)',
    description:
      'Kecemasan, depresi, overthinking, trauma, pengelolaan emosi, dan konflik keluarga pada remaja–dewasa.',
    rating: 4.9,
    ratingCount: 68,
    days: [1, 2, 3, 4],
    hours: [10, 12, 14, 16],
    base: 190000,
    minutes: 60,
  },
  {
    id: 'h-bagas',
    name: 'Bagas Wicaksono, M.Psi., Psikolog',
    gender: 'L',
    type: 'psikolog',
    title: 'Psikolog Klinis',
    license: 'SIPP: 0000-00-0-2 (contoh)',
    description:
      'Masalah klinis remaja–dewasa, burnout kerja, adiksi gawai, serta isu seputar pasangan dan pengasuhan.',
    rating: 4.8,
    ratingCount: 41,
    days: [2, 4, 6],
    hours: [9, 13, 19, 20],
    base: 210000,
    minutes: 60,
  },
  {
    id: 'h-dinda',
    name: 'Dinda Larasati, M.Psi., Psikolog',
    gender: 'P',
    type: 'psikolog',
    title: 'Psikolog Pendidikan',
    license: 'SIPP: 0000-00-0-3 (contoh)',
    description:
      'Kesulitan belajar, minat bakat, kecemasan akademik, dan pendampingan orang tua anak usia sekolah.',
    rating: 5,
    ratingCount: 23,
    days: [1, 3, 5],
    hours: [15, 16, 19],
    base: 195000,
    minutes: 60,
  },
  {
    id: 'h-salma',
    name: 'Salma Nuraini, S.Psi',
    gender: 'P',
    type: 'peer',
    title: 'Peer-Counselor',
    description:
      'Keluhan seputar diri, kecemasan, pengelolaan emosi, pengembangan diri, dan quarter life crisis.',
    rating: 4.9,
    ratingCount: 17,
    days: [1, 2, 3, 4, 5],
    hours: [19, 20, 21],
    base: 65000,
    minutes: 60,
  },
  {
    id: 'h-fajar',
    name: 'Fajar Ramadhan, S.Psi',
    gender: 'L',
    type: 'peer',
    title: 'Peer-Counselor',
    description:
      'Isu pribadi dan akademik, hubungan pertemanan, stres perkuliahan, dan adaptasi di dunia kerja.',
    rating: 4.7,
    ratingCount: 9,
    days: [0, 3, 6],
    hours: [8, 9, 20, 21],
    base: 70000,
    minutes: 60,
  },
  {
    id: 'h-yusuf',
    name: 'Yusuf Hidayat, M.Psi., Psikolog',
    gender: 'L',
    type: 'keluarga',
    title: 'Konselor Pernikahan & Keluarga',
    license: 'SIPP: 0000-00-0-4 (contoh)',
    description:
      'Komunikasi pasangan, konflik rumah tangga, persiapan pranikah, dan pengasuhan bersama.',
    rating: 4.9,
    ratingCount: 32,
    days: [2, 5, 6],
    hours: [10, 13, 16, 19],
    base: 150000,
    minutes: 75,
  },
  {
    id: 'h-maya',
    name: 'Maya Anggraini, M.Psi., Psikolog',
    gender: 'P',
    type: 'keluarga',
    title: 'Konselor Keluarga & Anak',
    license: 'SIPP: 0000-00-0-5 (contoh)',
    description:
      'Pola asuh, tumbuh kembang anak, hubungan orang tua–remaja, dan pemulihan setelah perpisahan.',
    rating: 4.8,
    ratingCount: 26,
    days: [1, 4, 6],
    hours: [9, 11, 15],
    base: 160000,
    minutes: 75,
  },
]

export const helpers: Helper[] = seeds.map(({ base, minutes, ...h }) => ({
  ...h,
  options: options(h.id, base, minutes),
}))

// ---- Jadwal -----------------------------------------------------------------

/** Slot yang sudah dipesan (in-memory; hilang saat server restart). */
export const bookedSlots = new Set<string>()

export interface Slot {
  id: string
  time: string
  available: boolean
}
export interface ScheduleDay {
  date: string // YYYY-MM-DD (WIB)
  slots: Slot[]
}

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000
const DAYS_AHEAD = 14

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export function buildSchedule(helper: Helper, now = new Date()): ScheduleDay[] {
  // "wib" adalah Date yang komponen UTC-nya menunjukkan waktu WIB
  const wib = new Date(now.getTime() + WIB_OFFSET_MS)
  const out: ScheduleDay[] = []
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate() + i))
    if (!helper.days.includes(d.getUTCDay())) continue
    const date = d.toISOString().slice(0, 10)
    const slots = helper.hours
      // hari ini: hanya jam yang masih minimal 1 jam lagi
      .filter((h) => i > 0 || h > wib.getUTCHours() + 1)
      .map((h) => {
        const id = `${helper.id}_${date}_${String(h).padStart(2, '0')}`
        // sebagian slot ditandai penuh secara deterministik agar terlihat realistis
        const taken = hash(id) % 5 === 0 || bookedSlots.has(id)
        return { id, time: `${String(h).padStart(2, '0')}:00`, available: !taken }
      })
    if (slots.length) out.push({ date, slots })
  }
  return out
}

export function findSlot(slotId: string) {
  const helper = helpers.find((h) => slotId.startsWith(h.id + '_'))
  if (!helper) return null
  for (const day of buildSchedule(helper)) {
    const slot = day.slots.find((s) => s.id === slotId)
    if (slot) return { helper, date: day.date, slot }
  }
  return null
}

// ---- Pendaftaran ------------------------------------------------------------

export const SCREENING_PRICE = 150000

export interface Booking {
  code: string
  kind: 'konseling' | 'skrining'
  createdAt: string
  total: number
  [key: string]: unknown
}

export const bookings = new Map<string, Booking>()

export function newCode(prefix: string) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `${prefix}-${s}`
}

export function validatePerson(p: any): string | null {
  if (!p || typeof p !== 'object') return 'Data diri wajib diisi.'
  if (typeof p.name !== 'string' || p.name.trim().length < 2) return 'Nama wajib diisi.'
  if (typeof p.whatsapp !== 'string' || !/^0\d{8,13}$/.test(p.whatsapp))
    return 'Nomor WhatsApp tidak valid (contoh: 081234567890).'
  if (typeof p.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
    return 'Email tidak valid.'
  return null
}
