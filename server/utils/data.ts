// Jadwal dan pendaftaran (disimpan di memori; hilang saat server restart).
// Harga, jam layanan, dan profil psikolog diatur di shared/utils/site.ts.

export interface Slot {
  id: string
  time: string // HH:MM WIB
  available: boolean
}
export interface ScheduleDay {
  date: string // YYYY-MM-DD (WIB)
  slots: Slot[]
}

/** Slot yang sudah dipesan. */
export const bookedSlots = new Set<string>()

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000
const toMin = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5))
const toHHMM = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** Jam mulai sesi dalam satu hari: sesi 60 menit + jeda, selama masih selesai sebelum jam tutup. */
function startTimes(from: string, to: string) {
  const { bufferMinutes } = SITE.availability
  const out: number[] = []
  for (let t = toMin(from); t + 60 <= toMin(to); t += 60 + bufferMinutes) out.push(t)
  return out
}

/**
 * Jadwal psikolog untuk `windowDays` ke depan, mengikuti jam layanan di site.ts.
 * Slot yang kurang dari `minNoticeHours` dari sekarang tidak ditampilkan.
 */
export function buildSchedule(now = new Date()): ScheduleDay[] {
  const { weekday, weekend, minNoticeHours, windowDays } = SITE.availability
  const pid = SITE.psychologist.id
  const earliest = now.getTime() + minNoticeHours * 3600_000
  // "wib" adalah Date yang komponen UTC-nya menunjukkan waktu WIB
  const wib = new Date(now.getTime() + WIB_OFFSET_MS)
  const out: ScheduleDay[] = []

  for (let i = 0; i < windowDays; i++) {
    const d = new Date(Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate() + i))
    const isWeekend = d.getUTCDay() === 0 || d.getUTCDay() === 6
    const hours = isWeekend ? weekend : weekday
    const date = d.toISOString().slice(0, 10)

    const slots = startTimes(hours.from, hours.to)
      // waktu mulai slot dalam UTC = tanggal WIB + menit - 7 jam
      .filter((m) => d.getTime() + m * 60_000 - WIB_OFFSET_MS >= earliest)
      .map((m) => {
        const time = toHHMM(m)
        const id = `${pid}_${date}_${time.replace(':', '')}`
        return { id, time, available: !bookedSlots.has(id) }
      })
    if (slots.length) out.push({ date, slots })
  }
  return out
}

export function findSlot(slotId: string) {
  for (const day of buildSchedule()) {
    const slot = day.slots.find((s) => s.id === slotId)
    if (slot) return { date: day.date, slot }
  }
  return null
}

// ---- Pendaftaran ------------------------------------------------------------

export interface Booking {
  code: string
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
