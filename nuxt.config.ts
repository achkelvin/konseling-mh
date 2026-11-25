import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: false },
  // Nilai diisi lewat .env (lihat .env.example). Contoh: NUXT_SMTP_HOST, NUXT_ADMIN_EMAIL.
  runtimeConfig: {
    smtp: { host: '', port: '587', user: '', pass: '', from: '' },
    // alamat penerima formulir; bawaan dari brief, bisa ditimpa NUXT_ADMIN_EMAIL
    adminEmail: 'renajiwa@gmail.com',
    public: {
      // WhatsApp admin dari brief (bisa ditimpa NUXT_PUBLIC_WHATSAPP_NUMBER)
      whatsappNumber: '+62 857-9373-1917',
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
          // font sesuai brief: Lora (judul) dan Inter (isi)
          href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap',
        },
      ],
    },
  },
})
