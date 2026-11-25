import id from '~/locales/id'
import en from '~/locales/en'

const messages = { id, en } as const
export type Messages = typeof id

/**
 * Bahasa antarmuka. Disimpan di cookie `lang` supaya render server
 * dan browser memakai bahasa yang sama (tidak berkedip saat dimuat).
 */
export function useLocale() {
  const cookie = useCookie<Lang>('lang', { default: () => 'id', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  const lang = useState<Lang>('lang', () => toLang(cookie.value))

  function setLang(next: Lang) {
    lang.value = next
    cookie.value = next
  }

  /** Teks untuk bahasa aktif. `m.value.home.title` dan seterusnya. */
  const m = computed<Messages>(() => messages[lang.value])

  /** Ganti `{nama}` pada teks dengan nilainya. */
  const fmt = (text: string, params: Record<string, string | number> = {}) =>
    text.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`))

  /** Label pilihan formulir (nilainya tetap bahasa Indonesia). */
  const opt = (value: string) => m.value.person.options[value] ?? value

  /** Tanggal sesuai bahasa: "Selasa, 17 November 2026" / "Tuesday, 17 November 2026". */
  const date = (d: string) => tanggal(d, lang.value)

  return { lang, setLang, m, fmt, opt, date }
}
