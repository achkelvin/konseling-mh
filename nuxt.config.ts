export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'KonselingMH — Konseling kesehatan mental online',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Konseling online bersama psikolog dan konselor terlatih. Pilih helper, pilih jadwal, dan mulai sesi dari mana saja.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@1,9..144,500&display=swap',
        },
      ],
    },
  },
})
