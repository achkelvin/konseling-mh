// Dipakai bersama oleh formulir (app/) dan validasi server (server/).
// Nilai pilihan disimpan dalam bahasa Indonesia agar email admin konsisten.

export const GENDERS = ['Laki-laki', 'Perempuan'] as const
export const RELIGIONS = ['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'] as const
export const EDUCATIONS = ['SD', 'SMP', 'SMA/SMK', 'D1–D3', 'D4/S1', 'S2', 'S3'] as const
export const MARITAL_STATUSES = ['Belum menikah', 'Menikah', 'Cerai hidup', 'Cerai mati'] as const
/** Topik umum sesuai brief (bagian 8). */
export const TOPICS = ['Stres', 'Cemas', 'Relasi', 'Keluarga', 'Akademik', 'Kerja', 'Lainnya'] as const
export const DISCOUNT_OPTIONS = ['none', 'student', 'diaspora'] as const
export const COUNSELED_OPTIONS = ['Ya', 'Tidak'] as const

export interface Person {
  fullName: string
  nickname: string
  whatsapp: string
  email: string
  /** kota dan negara domisili (untuk zona waktu) */
  city: string
  country: string
  gender: string
  religion: string
  education: string
  occupation: string
  birthDate: string // YYYY-MM-DD
  maritalStatus: string
  goal: string
  /** pernah konseling sebelumnya: 'Ya' | 'Tidak' */
  counseledBefore: string
  /** kategori diskon: bukti ditunjukkan ke admin lewat WhatsApp, tidak diunggah */
  discount: (typeof DISCOUNT_OPTIONS)[number]
  /** wajib bila klien di bawah 18 tahun */
  guardianName: string
  guardianContact: string
}

export const emptyPerson = (): Person => ({
  fullName: '',
  nickname: '',
  whatsapp: '',
  email: '',
  city: '',
  country: 'Indonesia',
  gender: '',
  religion: '',
  education: '',
  occupation: '',
  birthDate: '',
  maritalStatus: '',
  goal: '',
  counseledBefore: '',
  discount: 'none',
  guardianName: '',
  guardianContact: '',
})

/** Usia dalam tahun penuh dari tanggal lahir "YYYY-MM-DD"; null jika tidak valid. */
export function ageFrom(birthDate: string, today = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate)
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const born = new Date(Date.UTC(y, mo - 1, d))
  if (born.getUTCMonth() !== mo - 1 || born > today) return null
  let age = today.getUTCFullYear() - y
  if (today.getUTCMonth() + 1 < mo || (today.getUTCMonth() + 1 === mo && today.getUTCDate() < d)) age--
  return age
}

/** Klien di bawah 18 tahun harus didaftarkan orang tua/wali. */
export const ADULT_AGE = 18
export const isMinor = (birthDate: string) => {
  const a = ageFrom(birthDate)
  return a !== null && a < ADULT_AGE
}

export const MIN_GOAL = 10

export type Lang = 'id' | 'en'
export const toLang = (v: unknown): Lang => (v === 'en' ? 'en' : 'id')

/** Pesan validasi dalam dua bahasa (dipakai formulir dan server). */
const ERRORS = {
  id: {
    required: 'Data diri wajib diisi.',
    fullName: 'Nama lengkap wajib diisi.',
    whatsapp: 'Nomor WhatsApp tidak valid (contoh: 081234567890 atau +44…).',
    email: 'Email tidak valid.',
    city: 'Kota domisili wajib diisi.',
    country: 'Negara domisili wajib diisi.',
    gender: 'Jenis kelamin wajib dipilih.',
    religion: 'Agama wajib dipilih.',
    education: 'Pendidikan terakhir wajib dipilih.',
    occupation: 'Pekerjaan wajib diisi.',
    birthDate: 'Tanggal lahir tidak valid.',
    maritalStatus: 'Status pernikahan wajib dipilih.',
    goal: `Tujuan konseling minimal ${MIN_GOAL} karakter.`,
    counseledBefore: 'Pilih apakah kamu pernah konseling sebelumnya.',
    discount: 'Kategori diskon tidak valid.',
    guardian: 'Klien di bawah 18 tahun wajib didaftarkan orang tua/wali: isi nama dan kontak orang tua/wali.',
    guardianConsent: 'Centang pernyataan persetujuan orang tua/wali.',
    consent: 'Persetujuan layanan wajib dicentang.',
    service: 'Layanan tidak valid.',
    notBookable: 'Layanan ini tidak bisa dipesan langsung. Silakan hubungi admin lewat WhatsApp.',
    slot: 'Jadwal tidak ditemukan.',
    taken: 'Jadwal ini baru saja dipesan orang lain. Silakan pilih jadwal lain.',
  },
  en: {
    required: 'Personal details are required.',
    fullName: 'Full name is required.',
    whatsapp: 'Invalid WhatsApp number (example: 081234567890 or +44…).',
    email: 'Invalid email address.',
    city: 'City of residence is required.',
    country: 'Country of residence is required.',
    gender: 'Please select your gender.',
    religion: 'Please select your religion.',
    education: 'Please select your highest education.',
    occupation: 'Occupation is required.',
    birthDate: 'Invalid date of birth.',
    maritalStatus: 'Please select your marital status.',
    goal: `Counseling goal must be at least ${MIN_GOAL} characters.`,
    counseledBefore: 'Please tell us whether you have had counseling before.',
    discount: 'Invalid discount category.',
    guardian: "Clients under 18 must be registered by a parent/guardian: fill in the parent/guardian's name and contact.",
    guardianConsent: 'Please tick the parent/guardian consent statement.',
    consent: 'You must agree to the terms of service.',
    service: 'Invalid service.',
    notBookable: 'This service cannot be booked directly. Please contact the admin on WhatsApp.',
    slot: 'Schedule not found.',
    taken: 'This slot was just booked by someone else. Please choose another time.',
  },
} as const
export type ErrorKey = keyof (typeof ERRORS)['id']
export const errorText = (key: ErrorKey, lang: Lang = 'id') => ERRORS[lang][key]

/** Nomor WhatsApp: lokal (08…) atau internasional (+kode negara), 9–15 digit. */
export const WA_PATTERN = /^(\+\d{8,15}|0\d{8,13})$/

/** Mengembalikan pesan kesalahan pertama, atau null jika semua valid. */
export function personError(p: Partial<Person> | null | undefined, lang: Lang = 'id'): string | null {
  const e = (k: ErrorKey) => ERRORS[lang][k]
  if (!p || typeof p !== 'object') return e('required')
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  if (str(p.fullName).length < 2) return e('fullName')
  if (!WA_PATTERN.test(str(p.whatsapp).replace(/[\s-]/g, ''))) return e('whatsapp')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(p.email))) return e('email')
  if (str(p.city).length < 2) return e('city')
  if (str(p.country).length < 2) return e('country')
  if (!GENDERS.includes(p.gender as any)) return e('gender')
  if (!RELIGIONS.includes(p.religion as any)) return e('religion')
  if (!EDUCATIONS.includes(p.education as any)) return e('education')
  if (str(p.occupation).length < 2) return e('occupation')
  if (ageFrom(str(p.birthDate)) === null) return e('birthDate')
  if (!MARITAL_STATUSES.includes(p.maritalStatus as any)) return e('maritalStatus')
  if (str(p.goal).length < MIN_GOAL) return e('goal')
  if (!COUNSELED_OPTIONS.includes(p.counseledBefore as any)) return e('counseledBefore')
  if (!DISCOUNT_OPTIONS.includes(p.discount as any)) return e('discount')
  if (isMinor(str(p.birthDate)) && (str(p.guardianName).length < 2 || str(p.guardianContact).length < 5))
    return e('guardian')
  return null
}

const DISCOUNT_LABEL: Record<string, string> = { none: 'Tidak ada', student: 'Pelajar/Mahasiswa', diaspora: 'Diaspora' }

/** Baris untuk email admin (selalu bahasa Indonesia). */
export function personRows(p: Person): [string, string][] {
  const rows: [string, string][] = [
    ['Nama lengkap', p.fullName],
    ['Nama panggilan', p.nickname || '-'],
    ['WhatsApp', p.whatsapp],
    ['Email', p.email],
    ['Domisili', `${p.city}, ${p.country}`],
    ['Jenis kelamin', p.gender],
    ['Agama', p.religion],
    ['Pendidikan terakhir', p.education],
    ['Pekerjaan', p.occupation],
    ['Tanggal lahir', p.birthDate],
    ['Usia', `${ageFrom(p.birthDate)} tahun${isMinor(p.birthDate) ? ' (di bawah 18 — didaftarkan orang tua/wali)' : ''}`],
    ['Status pernikahan', p.maritalStatus],
    ['Pernah konseling', p.counseledBefore],
    ['Kategori diskon', DISCOUNT_LABEL[p.discount] ?? '-'],
    ['Tujuan konseling', p.goal],
  ]
  if (isMinor(p.birthDate)) {
    rows.push(['Orang tua/wali', p.guardianName], ['Kontak orang tua/wali', p.guardianContact])
  }
  return rows
}
