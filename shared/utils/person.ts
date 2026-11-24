// Dipakai bersama oleh formulir (app/) dan validasi server (server/).

export const GENDERS = ['Laki-laki', 'Perempuan'] as const
export const RELIGIONS = ['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'] as const
export const EDUCATIONS = ['SD', 'SMP', 'SMA/SMK', 'D1–D3', 'D4/S1', 'S2', 'S3'] as const
export const MARITAL_STATUSES = ['Belum menikah', 'Menikah', 'Cerai hidup', 'Cerai mati'] as const

export interface Person {
  fullName: string
  nickname: string
  whatsapp: string
  email: string
  gender: string
  religion: string
  education: string
  occupation: string
  birthDate: string // YYYY-MM-DD
  maritalStatus: string
  goal: string
}

export const emptyPerson = (): Person => ({
  fullName: '',
  nickname: '',
  whatsapp: '',
  email: '',
  gender: '',
  religion: '',
  education: '',
  occupation: '',
  birthDate: '',
  maritalStatus: '',
  goal: '',
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

export const MIN_AGE = 13
export const MIN_GOAL = 10

export type Lang = 'id' | 'en'
export const toLang = (v: unknown): Lang => (v === 'en' ? 'en' : 'id')

/** Pesan validasi dalam dua bahasa (dipakai formulir dan server). */
const ERRORS = {
  id: {
    required: 'Data diri wajib diisi.',
    fullName: 'Nama lengkap wajib diisi.',
    whatsapp: 'Nomor WhatsApp tidak valid (contoh: 081234567890).',
    email: 'Email tidak valid.',
    gender: 'Jenis kelamin wajib dipilih.',
    religion: 'Agama wajib dipilih.',
    education: 'Pendidikan terakhir wajib dipilih.',
    occupation: 'Pekerjaan wajib diisi.',
    birthDate: 'Tanggal lahir tidak valid.',
    minAge: `Usia minimal ${MIN_AGE} tahun.`,
    maritalStatus: 'Status pernikahan wajib dipilih.',
    goal: `Tujuan konseling minimal ${MIN_GOAL} karakter.`,
    story: 'Ceritakan permasalahanmu minimal 20 karakter.',
    consent: 'Persetujuan layanan wajib dicentang.',
    slot: 'Jadwal tidak ditemukan.',
    option: 'Metode konseling tidak valid.',
    taken: 'Jadwal ini baru saja dipesan orang lain. Silakan pilih jadwal lain.',
  },
  en: {
    required: 'Personal details are required.',
    fullName: 'Full name is required.',
    whatsapp: 'Invalid WhatsApp number (example: 081234567890).',
    email: 'Invalid email address.',
    gender: 'Please select your gender.',
    religion: 'Please select your religion.',
    education: 'Please select your highest education.',
    occupation: 'Occupation is required.',
    birthDate: 'Invalid date of birth.',
    minAge: `You must be at least ${MIN_AGE} years old.`,
    maritalStatus: 'Please select your marital status.',
    goal: `Counseling goal must be at least ${MIN_GOAL} characters.`,
    story: 'Please describe your concern in at least 20 characters.',
    consent: 'You must agree to the terms of service.',
    slot: 'Schedule not found.',
    option: 'Invalid counseling method.',
    taken: 'This slot was just booked by someone else. Please choose another time.',
  },
} as const
export type ErrorKey = keyof (typeof ERRORS)['id']
export const errorText = (key: ErrorKey, lang: Lang = 'id') => ERRORS[lang][key]

/** Mengembalikan pesan kesalahan pertama, atau null jika semua valid. */
export function personError(p: Partial<Person> | null | undefined, lang: Lang = 'id'): string | null {
  const e = (k: ErrorKey) => ERRORS[lang][k]
  if (!p || typeof p !== 'object') return e('required')
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  if (str(p.fullName).length < 2) return e('fullName')
  if (!/^0\d{8,13}$/.test(str(p.whatsapp))) return e('whatsapp')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(p.email))) return e('email')
  if (!GENDERS.includes(p.gender as any)) return e('gender')
  if (!RELIGIONS.includes(p.religion as any)) return e('religion')
  if (!EDUCATIONS.includes(p.education as any)) return e('education')
  if (str(p.occupation).length < 2) return e('occupation')
  const age = ageFrom(str(p.birthDate))
  if (age === null) return e('birthDate')
  if (age < MIN_AGE) return e('minAge')
  if (!MARITAL_STATUSES.includes(p.maritalStatus as any)) return e('maritalStatus')
  if (str(p.goal).length < MIN_GOAL) return e('goal')
  return null
}

/** Baris untuk email admin. */
export function personRows(p: Person): [string, string][] {
  return [
    ['Nama lengkap', p.fullName],
    ['Nama panggilan', p.nickname || '-'],
    ['WhatsApp', p.whatsapp],
    ['Email', p.email],
    ['Jenis kelamin', p.gender],
    ['Agama', p.religion],
    ['Pendidikan terakhir', p.education],
    ['Pekerjaan', p.occupation],
    ['Tanggal lahir', p.birthDate],
    ['Usia', `${ageFrom(p.birthDate)} tahun`],
    ['Status pernikahan', p.maritalStatus],
    ['Tujuan konseling', p.goal],
  ]
}
