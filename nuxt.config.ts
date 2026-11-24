import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: false },
  // Nilai diisi lewat .env (lihat .env.example). Contoh: NUXT_SMTP_HOST, NUXT_ADMIN_EMAIL.
  runtimeConfig: {
    smtp: { host: '', port: '587', user: '', pass: '', from: '' },
    adminEmail: '',
    public: {
      whatsappNumber: '0800-0000-0000',
      qrisPayload: '',
      // Rekening tujuan pembayaran (bisa ditimpa lewat NUXT_PUBLIC_BANK_*)
      bank: { name: 'Bank Mandiri', account: '1770011516751', holder: 'Nadiah Cahyani' },
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Rena Jiwa — Konseling kesehatan mental online',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Konseling online bersama psikolog dan konselor terlatih. Pilih helper, pilih jadwal, dan mulai sesi dari mana saja.',
        },
        { name: 'theme-color', content: '#384538' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/brand/icon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
