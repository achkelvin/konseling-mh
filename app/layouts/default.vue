<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-40 border-b border-sand-200/70 bg-sand-50/90 backdrop-blur">
      <div class="container-page flex h-16 items-center justify-between gap-4">
        <AppLogo />
        <nav class="hidden items-center gap-7 text-sm font-medium md:flex" aria-label="Utama">
          <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="hover:text-brand-600">
            {{ l.label }}
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-2">
          <NuxtLink to="/konseling" class="btn-primary hidden !py-2.5 sm:inline-flex">
            Daftar Konseling
          </NuxtLink>
          <button
            class="rounded-full p-2 md:hidden"
            :aria-expanded="open"
            aria-label="Buka menu"
            @click="open = !open"
          >
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path v-if="!open" d="M4 7h16M4 12h16M4 17h16" />
              <path v-else d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
      <nav v-if="open" class="border-t border-sand-200 bg-sand-50 md:hidden" aria-label="Menu">
        <div class="container-page flex flex-col py-3">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="rounded-lg px-2 py-3 text-sm font-medium hover:bg-brand-50"
            @click="open = false"
          >
            {{ l.label }}
          </NuxtLink>
          <NuxtLink to="/konseling" class="btn-primary mt-2" @click="open = false">
            Daftar Konseling
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer id="kontak" class="bg-brand-900 text-brand-100">
      <div class="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p class="text-lg font-extrabold text-white">Konseling<span class="text-accent-400">MH</span></p>
          <p class="mt-3 text-sm leading-relaxed text-brand-200">
            Platform konseling kesehatan mental online. Aman, rahasia, dan ditangani tenaga terlatih.
          </p>
        </div>
        <div>
          <p class="text-sm font-semibold text-white">Layanan</p>
          <ul class="mt-3 space-y-2 text-sm text-brand-200">
            <li><NuxtLink to="/konseling" class="hover:text-white">Konseling</NuxtLink></li>
            <li><NuxtLink to="/cek-kesehatan-mental" class="hover:text-white">Cek Kesehatan Mental</NuxtLink></li>
            <li><NuxtLink to="/jadwal" class="hover:text-white">Jadwal Helper</NuxtLink></li>
          </ul>
        </div>
        <div>
          <p class="text-sm font-semibold text-white">Hubungi Kami</p>
          <ul class="mt-3 space-y-2 text-sm text-brand-200">
            <li>WhatsApp: 0800-0000-0000</li>
            <li>halo@konselingmh.example</li>
            <li>Senin–Sabtu, 08.00–21.00 WIB</li>
          </ul>
        </div>
        <div class="rounded-2xl bg-white/5 p-4 text-sm leading-relaxed text-brand-100">
          <p class="font-semibold text-white">Dalam keadaan darurat?</p>
          <p class="mt-1">
            Layanan ini bukan layanan gawat darurat. Jika kamu atau orang terdekat dalam bahaya,
            segera hubungi 119 atau IGD rumah sakit terdekat.
          </p>
        </div>
      </div>
      <div class="border-t border-white/10 py-5 text-center text-xs text-brand-200">
        © {{ new Date().getFullYear() }} KonselingMH. Hak cipta dilindungi.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const open = ref(false)
const links = [
  { to: '/#layanan', label: 'Layanan' },
  { to: '/#helper', label: 'Helper' },
  { to: '/#cek', label: 'Cek Kesehatan Mental' },
  { to: '/#profil', label: 'Profil' },
  { to: '/jadwal', label: 'Jadwal Helper' },
]
</script>
