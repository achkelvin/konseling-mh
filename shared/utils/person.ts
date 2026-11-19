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

/** Mengembalikan pesan kesalahan pertama, atau null jika semua valid. */
export function personError(p: Partial<Person> | null | undefined): string | null {
  if (!p || typeof p !== 'object') return 'Data diri wajib diisi.'
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  if (str(p.fullName).length < 2) return 'Nama lengkap wajib diisi.'
  if (!/^0\d{8,13}$/.test(str(p.whatsapp))) return 'Nomor WhatsApp tidak valid (contoh: 081234567890).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(p.email))) return 'Email tidak valid.'
  if (!GENDERS.includes(p.gender as any)) return 'Jenis kelamin wajib dipilih.'
  if (!RELIGIONS.includes(p.religion as any)) return 'Agama wajib dipilih.'
  if (!EDUCATIONS.includes(p.education as any)) return 'Pendidikan terakhir wajib dipilih.'
  if (str(p.occupation).length < 2) return 'Pekerjaan wajib diisi.'
  const age = ageFrom(str(p.birthDate))
  if (age === null) return 'Tanggal lahir tidak valid.'
  if (age < MIN_AGE) return `Usia minimal ${MIN_AGE} tahun.`
  if (!MARITAL_STATUSES.includes(p.maritalStatus as any)) return 'Status pernikahan wajib dipilih.'
  if (str(p.goal).length < MIN_GOAL) return `Tujuan konseling minimal ${MIN_GOAL} karakter.`
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
