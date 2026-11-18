<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-b from-brand-50 to-sand-50">
      <div class="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p class="eyebrow">Konseling online</p>
          <h1 class="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-brand-900 sm:text-5xl">
            Ceritakan bebanmu,
            <span class="font-display font-medium italic text-accent-500">kapan pun</span>
            kamu siap.
          </h1>
          <p class="mt-5 max-w-md text-base leading-relaxed text-ink/70">
            Pilih helper dan jadwal, isi formulir singkat, lalu bayar dengan QRIS. Semudah itu.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/konseling" class="btn-primary">Daftar Konseling</NuxtLink>
            <NuxtLink to="/cek-kesehatan-mental" class="btn-secondary">Cek Kesehatan Mental</NuxtLink>
          </div>
          <ul class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
            <li>✓ Rahasia terjaga</li>
            <li>✓ Helper terverifikasi</li>
            <li>✓ Bayar pakai QRIS</li>
          </ul>
        </div>

        <!-- Ilustrasi: kartu percakapan -->
        <div class="relative mx-auto w-full max-w-md" aria-hidden="true">
          <div class="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-accent-100/70 blur-2xl" />
          <div class="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-brand-100 blur-2xl" />
          <div class="card relative space-y-3 shadow-soft">
            <div class="flex items-center gap-3 border-b border-sand-100 pb-3">
              <HelperAvatar name="Ratna Paramita" />
              <div>
                <p class="text-sm font-semibold">Ratna Paramita, M.Psi., Psikolog</p>
                <p class="text-xs text-brand-600">● Sesi berlangsung</p>
              </div>
            </div>
            <p class="w-fit max-w-[80%] rounded-2xl rounded-tl-sm bg-sand-100 px-4 py-2.5 text-sm">
              Terima kasih sudah mau bercerita. Apa yang paling terasa berat minggu ini?
            </p>
            <p class="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-2.5 text-sm text-white">
              Aku susah tidur karena terus kepikiran pekerjaan…
            </p>
            <p class="w-fit max-w-[80%] rounded-2xl rounded-tl-sm bg-sand-100 px-4 py-2.5 text-sm">
              Kita urai pelan-pelan ya. Kamu tidak sendirian.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Layanan -->
    <section id="layanan" class="container-page py-20">
      <p class="eyebrow">Konseling</p>
      <h2 class="mt-2 text-3xl font-bold tracking-tight">Pilih layanan sesuai kebutuhanmu</h2>
      <div class="mt-10 grid gap-6 md:grid-cols-3">
        <article v-for="s in data?.services" :key="s.id" class="card flex flex-col transition hover:shadow-soft">
          <h3 class="text-xl font-bold">{{ s.label }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink/70">{{ s.description }}</p>
          <ul class="mt-4 space-y-2 text-sm">
            <li v-for="p in s.points" :key="p" class="flex gap-2">
              <span class="text-brand-500">✓</span>{{ p }}
            </li>
          </ul>
          <div class="mt-auto pt-6">
            <p class="text-xs text-ink/60">Per sesi ({{ s.durationMinutes }} menit), mulai dari</p>
            <p class="text-2xl font-extrabold text-brand-700">{{ rupiah(s.priceFrom) }}</p>
            <NuxtLink :to="`/konseling?type=${s.id}`" class="btn-primary mt-4 w-full">Daftar Konseling</NuxtLink>
          </div>
        </article>
      </div>

      <!-- Cara kerja -->
      <ol class="mt-14 grid gap-4 rounded-3xl bg-brand-900 p-6 text-white sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
        <li v-for="(h, i) in howItWorks" :key="h.title">
          <span class="font-display text-3xl italic text-accent-400">{{ i + 1 }}</span>
          <p class="mt-1 font-semibold">{{ h.title }}</p>
          <p class="mt-1 text-sm text-brand-200">{{ h.text }}</p>
        </li>
      </ol>
    </section>

    <!-- Helper -->
    <section id="helper" class="bg-white py-20">
      <div class="container-page">
        <h2 class="text-center font-display text-4xl italic text-brand-700">Our Helpers</h2>
        <div class="mt-6 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Jenis helper">
          <button
            v-for="s in data?.services"
            :key="s.id"
            role="tab"
            :aria-selected="tab === s.id"
            class="rounded-full border px-4 py-1.5 text-sm font-medium transition"
            :class="tab === s.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-sand-200 hover:border-brand-200'"
            @click="tab = s.id"
          >
            {{ s.label }}
          </button>
        </div>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article v-for="h in shownHelpers" :key="h.id" class="card flex flex-col items-center text-center">
            <HelperAvatar :name="h.name" size="lg" />
            <h3 class="mt-4 text-sm font-semibold">{{ h.name }}</h3>
            <p class="text-sm font-bold text-brand-700">{{ h.title }}</p>
            <p v-if="h.license" class="text-xs text-ink/50">{{ h.license }}</p>
            <p class="mt-3 text-sm leading-relaxed text-ink/70">{{ h.description }}</p>
          </article>
        </div>
        <div class="mt-8 text-center">
          <NuxtLink to="/jadwal" class="btn-secondary">Lihat Jadwal Helper</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Cek kesehatan mental -->
    <section id="cek" class="bg-accent-50 py-20">
      <div class="container-page grid items-center gap-10 md:grid-cols-2">
        <div>
          <p class="eyebrow">Cek Kesehatan Mental</p>
          <h2 class="mt-2 text-3xl font-bold tracking-tight">Penasaran dengan kondisi kesehatan mentalmu?</h2>
          <h3 class="mt-6 text-sm font-semibold text-accent-600">Gejala yang dideteksi</h3>
          <ul class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <li v-for="g in symptoms" :key="g" class="rounded-xl border border-accent-100 bg-white px-3 py-2 text-sm">
              {{ g }}
            </li>
          </ul>
          <h3 class="mt-6 text-sm font-semibold text-accent-600">Apa yang didapatkan?</h3>
          <ul class="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <li v-for="b in benefits" :key="b">• {{ b }}</li>
          </ul>
          <div class="mt-8 flex flex-wrap items-center gap-5">
            <div>
              <p class="text-xs text-ink/60">Harga</p>
              <p class="text-3xl font-extrabold text-brand-900">{{ rupiah(data?.screening.price ?? 0) }}</p>
            </div>
            <NuxtLink to="/cek-kesehatan-mental" class="btn-secondary">Daftar Sekarang</NuxtLink>
          </div>
        </div>

        <!-- Ilustrasi: contoh laporan -->
        <div class="card mx-auto w-full max-w-sm rotate-2 shadow-soft" aria-hidden="true">
          <p class="text-xs font-semibold uppercase tracking-widest text-ink/40">Laporan hasil</p>
          <div v-for="r in report" :key="r.label" class="mt-4">
            <div class="flex justify-between text-sm">
              <span>{{ r.label }}</span>
              <span class="font-semibold">{{ r.level }}</span>
            </div>
            <div class="mt-1.5 h-2 rounded-full bg-sand-100">
              <div class="h-2 rounded-full" :class="r.color" :style="{ width: r.value + '%' }" />
            </div>
          </div>
          <p class="mt-5 rounded-xl bg-sand-50 p-3 text-xs leading-relaxed text-ink/60">
            Interpretasi ditulis oleh psikolog dan dibacakan dalam sesi 15 menit.
          </p>
        </div>
      </div>
    </section>

    <!-- Profil -->
    <section id="profil" class="container-page py-20">
      <p class="eyebrow">Profil</p>
      <h2 class="mt-2 text-3xl font-bold tracking-tight">Mengenal lebih jauh KonselingMH</h2>
      <div class="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-ink/75">
        <p>
          KonselingMH adalah platform kesehatan mental yang menghubungkan kamu dengan psikolog dan
          konselor terlatih. Kami percaya pertolongan psikologis seharusnya mudah dijangkau,
          terjangkau, dan bebas dari stigma.
        </p>
        <p>
          Setiap helper melewati proses seleksi dan supervisi. Kerahasiaan cerita klien dijaga
          sesuai kode etik psikologi.
        </p>
      </div>

      <h3 class="mt-14 text-xl font-bold">Pertanyaan yang sering ditanyakan</h3>
      <div class="mt-4 divide-y divide-sand-200 rounded-3xl border border-sand-200 bg-white">
        <details v-for="f in faqs" :key="f.q" class="group p-5">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
            {{ f.q }}
            <span class="text-xl text-brand-500 transition group-open:rotate-45">+</span>
          </summary>
          <p class="mt-3 text-sm leading-relaxed text-ink/70">{{ f.a }}</p>
        </details>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/services')
const { data: helpers } = await useFetch('/api/helpers')

const tab = ref('psikolog')
const shownHelpers = computed(() => helpers.value?.filter((h) => h.type === tab.value) ?? [])

const howItWorks = [
  { title: 'Pilih helper & jadwal', text: 'Lihat profil dan slot yang masih kosong.' },
  { title: 'Isi formulir', text: 'Data diri dan cerita singkat, terkirim ke email admin.' },
  { title: 'Bayar dengan QRIS', text: 'Nominal sudah terisi, scan dari aplikasi apa pun.' },
  { title: 'Konfirmasi & mulai sesi', text: 'Kirim bukti via WhatsApp, admin mengirim tautan sesi.' },
]
const symptoms = ['Stres', 'Cemas', 'Depresi', 'PTSD', 'Psikotik', 'Psikoaktif']
const benefits = ['Hasil berupa PDF', 'Interpretasi oleh psikolog', 'Pembacaan hasil 15 menit']
const report = [
  { label: 'Stres', level: 'Sedang', value: 58, color: 'bg-accent-400' },
  { label: 'Cemas', level: 'Ringan', value: 32, color: 'bg-brand-500' },
  { label: 'Depresi', level: 'Normal', value: 14, color: 'bg-brand-200' },
]
const faqs = [
  { q: 'Apakah cerita saya dijaga kerahasiaannya?', a: 'Ya. Isi formulir hanya dibaca admin dan helper, sesuai kode etik psikologi.' },
  { q: 'Bagaimana cara pembayarannya?', a: 'Setelah mendaftar, kamu mendapat QRIS dengan nominal yang sudah terisi. Scan dari m-banking atau e-wallet apa pun, lalu kirim bukti ke WhatsApp admin.' },
  { q: 'Kapan jadwal saya dikonfirmasi?', a: 'Setelah admin memverifikasi pembayaran, biasanya dalam 1×24 jam. Tautan sesi dikirim lewat WhatsApp atau email.' },
  { q: 'Bisakah saya mengganti jadwal?', a: 'Bisa, hubungi admin lewat WhatsApp paling lambat 12 jam sebelum sesi dimulai.' },
]
</script>
