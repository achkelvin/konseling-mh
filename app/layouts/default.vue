<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-40 border-b border-brand-700/10 bg-sand-100/90 backdrop-blur">
      <div class="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <AppLogo />
        <nav class="hidden items-center gap-6 text-sm font-medium text-brand-700 xl:flex" :aria-label="m.nav.main">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent-600 after:transition hover:after:scale-x-100"
          >
            {{ l.label }}
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-2">
          <LangSwitch />
          <NuxtLink to="/konseling" class="btn-primary hidden !py-2.5 sm:inline-flex">
            {{ m.common.register }}
          </NuxtLink>
          <button
            class="rounded-lg p-2 text-brand-700 xl:hidden"
            :aria-expanded="open"
            :aria-label="m.nav.openMenu"
            @click="open = !open"
          >
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path v-if="!open" d="M4 7h16M4 12h16M4 17h10" />
              <path v-else d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
      <nav v-if="open" class="border-t border-brand-700/10 bg-sand-100 xl:hidden" :aria-label="m.nav.menu">
        <div class="container-page flex flex-col py-3">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="border-b border-brand-700/10 px-1 py-3.5 font-display text-lg text-brand-700"
            @click="open = false"
          >
            {{ l.label }}
          </NuxtLink>
          <NuxtLink to="/konseling" class="btn-primary mt-4" @click="open = false">
            {{ m.common.register }}
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer id="kontak" class="relative overflow-hidden bg-brand-700 text-sand-100">
      <HalfMoons class="pointer-events-none absolute -right-16 -top-10 w-72 opacity-20" />
      <div class="container-page relative py-16">
        <div class="flex flex-col gap-6 border-b border-sand-100/15 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <AppLogo variant="reversed" size="lg" />
            <p class="mt-4 font-display text-xl italic text-accent-300">{{ m.home.tagline }}</p>
          </div>
          <p class="max-w-sm text-sm leading-relaxed text-sand-100/75">{{ m.footer.tagline }}</p>
        </div>

        <div class="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p class="eyebrow !text-accent-300">{{ m.footer.services }}</p>
            <ul class="mt-4 space-y-2.5 text-sm">
              <li><NuxtLink to="/#layanan" class="hover:text-accent-300">{{ m.nav.services }}</NuxtLink></li>
              <li><NuxtLink to="/konseling" class="hover:text-accent-300">{{ m.common.register }}</NuxtLink></li>
              <li><NuxtLink to="/cek-kesehatan-mental" class="hover:text-accent-300">{{ m.nav.checkup }}</NuxtLink></li>
              <li><NuxtLink to="/#faq" class="hover:text-accent-300">{{ m.nav.faq }}</NuxtLink></li>
              <li><NuxtLink to="/testimoni" class="hover:text-accent-300">{{ m.testi.nav }}</NuxtLink></li>
            </ul>
          </div>
          <div>
            <p class="eyebrow !text-accent-300">{{ m.footer.contact }}</p>
            <ul class="mt-4 space-y-2.5 text-sm text-sand-100/85">
              <li>
                <a :href="`https://wa.me/${SITE.contact.whatsapp}`" target="_blank" rel="noopener" class="hover:text-accent-300">
                  WhatsApp {{ SITE.contact.whatsappDisplay }}
                </a>
              </li>
              <li><a :href="`mailto:${SITE.brand.email}`" class="hover:text-accent-300">{{ SITE.brand.email }}</a></li>
              <li>
                <a :href="`https://instagram.com/${SITE.brand.instagram.slice(1)}`" target="_blank" rel="noopener" class="hover:text-accent-300">
                  Instagram {{ SITE.brand.instagram }}
                </a>
              </li>
            </ul>
            <p class="eyebrow mt-8 !text-accent-300">{{ m.footer.legal }}</p>
            <ul class="mt-4 space-y-2.5 text-sm">
              <li><NuxtLink to="/kebijakan-privasi" class="hover:text-accent-300">{{ m.footer.privacy }}</NuxtLink></li>
              <li><NuxtLink to="/syarat-layanan" class="hover:text-accent-300">{{ m.footer.terms }}</NuxtLink></li>
            </ul>
          </div>

          <!-- Keadaan darurat (wajib, brief bagian 10) -->
          <div id="darurat" class="rounded-xl border border-sand-100/20 p-5 text-sm leading-relaxed sm:col-span-2">
            <p class="font-display text-lg">{{ m.footer.emergencyTitle }}</p>
            <p class="mt-1.5 text-sand-100/80">{{ m.footer.emergencyText }}</p>
            <dl class="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sand-100/90">
              <div v-for="e in SITE.emergency" :key="e.country" class="flex justify-between gap-3 border-b border-sand-100/10 py-1">
                <dt class="text-sand-100/70">{{ lang === 'en' ? e.countryEn : e.country }}</dt>
                <dd class="text-right font-semibold">{{ e.number }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div class="relative border-t border-sand-100/15 py-5 text-center text-xs text-sand-100/60">
        © {{ new Date().getFullYear() }} Rena Jiwa. {{ m.footer.rights }}
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { m, lang } = useLocale()
const open = ref(false)
const links = computed(() => [
  { to: '/#layanan', label: m.value.nav.services },
  { to: '/#cara-kerja', label: m.value.nav.how },
  { to: '/cek-kesehatan-mental', label: m.value.nav.checkup },
  { to: '/#tentang', label: m.value.nav.about },
  { to: '/#faq', label: m.value.nav.faq },
  { to: '#kontak', label: m.value.nav.contact },
  // menu jadwal per psikolog disembunyikan sampai ada psikolog mitra
  ...(SITE.featureFlags.showPsychologistPicker ? [{ to: '/jadwal', label: m.value.nav.schedule }] : []),
])
</script>
