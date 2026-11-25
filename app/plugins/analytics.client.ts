/**
 * Vercel Analytics (tanpa cookie). Cara pasang untuk framework tanpa paket resmi:
 * antrean window.va + skrip /_vercel/insights/script.js yang disediakan Vercel
 * setelah Analytics diaktifkan di dashboard proyek (tab Analytics → Enable).
 * Hanya dimuat di build produksi; di localhost skrip itu tidak ada.
 */
declare global {
  interface Window {
    va?: (...args: unknown[]) => void
    vaq?: unknown[][]
  }
}

export default defineNuxtPlugin(() => {
  if (import.meta.dev || !SITE.analytics.vercel) return

  window.va =
    window.va ||
    function (...args: unknown[]) {
      ;(window.vaq = window.vaq || []).push(args)
    }

  const s = document.createElement('script')
  s.defer = true
  s.src = '/_vercel/insights/script.js'
  document.head.appendChild(s)
})
