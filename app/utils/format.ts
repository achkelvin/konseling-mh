export const rupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID')

/** "2026-11-17" -> "Selasa, 17 November 2026" (atau "Tuesday, 17 November 2026" untuk en) */
export const tanggal = (date: string, lang: 'id' | 'en' = 'id') =>
  new Date(date + 'T00:00:00Z').toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

export const typeLabel: Record<string, string> = {
  psikolog: 'Psikolog',
  peer: 'Peer-Counselor',
  keluarga: 'Konselor Keluarga',
}

export const initials = (name: string) =>
  name
    .split(',')[0]!
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

/** "0812-3456-7890" -> "6281234567890" untuk tautan wa.me */
export const waNumber = (n: string) => n.replace(/\D/g, '').replace(/^0/, '62')
