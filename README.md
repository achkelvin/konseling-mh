# Rena Jiwa

*Awal baru dimulai dari bercerita.* Situs konsultasi psikologi online Rena Jiwa (Nuxt 4 + Tailwind).

- Konten dan aturan bisnis: `contents/RenaJiwa_Brief_Website.md`, teks legal: `contents/RenaJiwa_Draf_Legal.md`
- Harga, layanan, diskon, kontak, jam layanan, Cal.com, dan feature flag: `shared/utils/site.ts`
- Teks antarmuka (Indonesia/Inggris): `app/locales/id.ts`, `app/locales/en.ts`
- Logo: `contents/RenaJiwa_Logo_Pack` (salinan untuk web di `public/brand`)

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
```

Salin `.env.example` menjadi `.env` untuk SMTP (email formulir) dan pengaturan lain. Tanpa SMTP, email
disimpan sebagai file HTML di `.outbox/`.

## Testimoni

Klien mengisi formulir di `/testimoni` (tautan di footer dan di bagian testimoni beranda).
Setiap kiriman disimpan sebagai *pending* dan admin menerima email dengan tombol **Setujui** / **Tolak**.
Yang disetujui langsung tampil di beranda; bagian testimoni tersembunyi selama belum ada yang disetujui.

Penyiapan di Vercel (sekali saja):
1. **Storage → Upstash Redis** (paket gratis) → hubungkan ke proyek. Ini mengisi `KV_REST_API_URL` dan
   `KV_REST_API_TOKEN` otomatis. Lokal tanpa variabel itu, data disimpan di `.data/testimonials.json`.
2. Environment Variables: `NUXT_TESTIMONIALS_SECRET` = teks acak panjang (untuk tautan Setujui/Tolak).
3. SMTP harus aktif agar email moderasi terkirim. Redeploy.

## Deploy ke Vercel

1. Import repo ini di vercel.com → New Project. Framework: Nuxt (terdeteksi otomatis).
2. Isi Environment Variables dari `.env.example` (minimal `NUXT_SMTP_*`).
3. Analytics: tab **Analytics → Enable** di dashboard proyek.
4. Alamat gratis: **Settings → Domains → Add** lalu ketik `renajiwa.vercel.app` (jika masih tersedia).
   Jika memakai alamat lain, ubah `SITE.brand.siteUrl` di `shared/utils/site.ts`.

Catatan brief: sebagian ISP di Türkiye dilaporkan memblokir `*.vercel.app`, jadi siapkan juga domain
sendiri (usulan: `renajiwa.my.id`) dan/atau deploy kedua (mis. GitHub Pages / Netlify).
