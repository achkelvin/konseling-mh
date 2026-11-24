<template>
  <div>
    <!-- ───────────── Hero ───────────── -->
    <section class="relative overflow-hidden">
      <div class="container-page grid items-center gap-12 pb-16 pt-12 md:grid-cols-[1.1fr_0.9fr] md:pb-24 md:pt-20">
        <div>
          <p class="eyebrow">{{ m.home.eyebrow }}</p>
          <h1 class="mt-4 text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-brand-700 sm:text-6xl">
            {{ m.home.tagline }}<span class="text-accent-600">.</span>
          </h1>
          <p class="mt-6 max-w-md text-lg leading-relaxed text-ink/75">{{ m.home.lead }}</p>
          <div class="mt-9 flex flex-wrap gap-3">
            <NuxtLink to="/konseling" class="btn-primary">
              {{ m.common.register }}
              <span aria-hidden="true">→</span>
            </NuxtLink>
            <NuxtLink to="/cek-kesehatan-mental" class="btn-ghost">{{ m.common.checkup }}</NuxtLink>
          </div>
          <ul class="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-brand-700/15 pt-5 text-sm text-ink/70">
            <li v-for="b in m.home.badges" :key="b" class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />{{ b }}
            </li>
          </ul>
        </div>

        <!-- Komposisi motif logo + kutipan -->
        <div class="relative mx-auto w-full max-w-md" aria-hidden="true">
          <div class="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-700">
            <HalfMoons class="absolute inset-x-8 top-14 w-[calc(100%-4rem)]" />
            <svg viewBox="0 0 220 260" class="absolute inset-x-8 top-14 w-[calc(100%-4rem)]" fill="none">
              <path d="M40 10 V250 M40 112 L180 250 V10" stroke="#F5F1E8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity=".9" />
            </svg>
          </div>
          <figure class="absolute -bottom-8 -left-4 max-w-[17rem] rounded-2xl bg-sand-50 p-5 shadow-soft sm:-left-10">
            <blockquote class="font-display text-[1.05rem] italic leading-snug text-brand-700">“{{ m.home.quote }}”</blockquote>
            <figcaption class="mt-3 text-xs font-medium uppercase tracking-widest text-accent-600">{{ m.home.quoteBy }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ───────────── Layanan ───────────── -->
    <section id="layanan" class="border-t border-brand-700/10 bg-sand-50 py-20">
      <div class="container-page">
        <div class="max-w-xl">
          <p class="eyebrow">{{ m.home.servicesEyebrow }}</p>
          <h2 class="mt-3 text-3xl font-semibold tracking-tight text-brand-700 sm:text-4xl">{{ m.home.servicesTitle }}</h2>
        </div>
        <div class="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
          <article v-for="(s, i) in data?.services" :key="s.id" class="group flex flex-col border-t-2 border-brand-700 pt-6">
            <span class="font-display text-sm font-semibold text-accent-600">0{{ i + 1 }}</span>
            <h3 class="mt-2 text-2xl font-semibold text-brand-700">{{ svc(s.id).label }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-ink/75">{{ svc(s.id).description }}</p>
            <ul class="mt-5 space-y-2 text-sm">
              <li v-for="p in svc(s.id).points" :key="p" class="flex gap-2.5">
                <span class="mt-1.5 h-2 w-1 shrink-0 rounded-r-full bg-accent-500" aria-hidden="true" />{{ p }}
              </li>
            </ul>
            <NuxtLink
              :to="`/konseling?type=${s.id}`"
              class="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-brand-700 underline decoration-accent-500 decoration-2 underline-offset-[6px] transition group-hover:gap-3"
            >
              {{ m.common.register }} <span aria-hidden="true">→</span>
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <!-- ───────────── Harga ───────────── -->
    <section class="py-20">
      <div class="container-page grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start">
        <div>
          <p class="eyebrow">{{ m.home.priceEyebrow }}</p>
          <h2 class="mt-3 text-3xl font-semibold tracking-tight text-brand-700 sm:text-4xl">{{ m.home.priceTitle }}</h2>
          <p class="mt-4 max-w-sm leading-relaxed text-ink/75">{{ m.home.priceLead }}</p>
        </div>
        <ul class="divide-y divide-brand-700/15 border-y border-brand-700/15">
          <li v-for="(row, i) in m.home.priceRows" :key="row.method" class="flex items-baseline justify-between gap-6 py-6">
            <div>
              <p class="font-display text-xl font-semibold text-brand-700">{{ row.method }}</p>
              <p class="mt-1 text-sm text-ink/65">{{ row.note }}</p>
            </div>
            <p class="shrink-0 text-right">
              <span class="block font-display text-2xl font-semibold text-accent-600">{{ rupiah(prices[i] ?? 0) }}</span>
              <span class="text-xs text-ink/55">/ 60 {{ m.common.minutes }}</span>
            </p>
          </li>
        </ul>
      </div>
    </section>

    <!-- ───────────── Cara kerja ───────────── -->
    <section class="bg-brand-700 py-20 text-sand-100">
      <div class="container-page">
        <ol class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="(h, i) in m.home.how" :key="h.title" class="relative">
            <div class="flex items-center gap-3">
              <span
                class="flex h-11 w-11 items-center justify-center rounded-l-full font-display text-lg font-semibold text-brand-900"
                :class="i % 2 === 0 ? 'bg-senja text-sand-50' : 'bg-brand-400'"
              >{{ i + 1 }}</span>
              <span v-if="i < 3" class="hidden h-px flex-1 bg-sand-100/25 lg:block" aria-hidden="true" />
            </div>
            <p class="mt-5 font-display text-lg font-semibold">{{ h.title }}</p>
            <p class="mt-1.5 text-sm leading-relaxed text-sand-100/75">{{ h.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ───────────── Helper ───────────── -->
    <section id="helper" class="py-20">
      <div class="container-page">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 class="text-3xl font-semibold tracking-tight text-brand-700 sm:text-4xl">{{ m.home.helpersTitle }}</h2>
          <div class="flex flex-wrap gap-6 border-b border-brand-700/15" role="tablist" :aria-label="m.home.helperTypes">
            <button
              v-for="s in data?.services"
              :key="s.id"
              role="tab"
              :aria-selected="tab === s.id"
              class="-mb-px border-b-2 pb-3 text-sm font-semibold transition"
              :class="tab === s.id ? 'border-accent-600 text-brand-700' : 'border-transparent text-ink/55 hover:text-brand-700'"
              @click="tab = s.id"
            >
              {{ svc(s.id).label }}
            </button>
          </div>
        </div>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article v-for="h in shownHelpers" :key="h.id" class="card flex gap-4 transition hover:border-brand-300">
            <HelperAvatar :name="h.name" />
            <div>
              <h3 class="font-display text-base font-semibold leading-snug text-brand-700">{{ h.name }}</h3>
              <p class="mt-0.5 text-sm font-medium text-accent-600">{{ m.helpers[h.id]?.title ?? h.title }}</p>
              <p v-if="h.license" class="text-xs text-ink/50">{{ h.license }}</p>
              <p class="mt-3 text-sm leading-relaxed text-ink/75">{{ m.helpers[h.id]?.description ?? h.description }}</p>
            </div>
          </article>
        </div>
        <NuxtLink to="/jadwal" class="btn-ghost mt-10">{{ m.home.seeSchedule }} <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </section>

    <!-- ───────────── Cek kesehatan mental ───────────── -->
    <section id="cek" class="py-6 sm:py-10">
      <div class="container-page">
        <div class="relative grid items-center gap-12 overflow-hidden rounded-[2rem] bg-brand-100 p-8 sm:p-12 md:grid-cols-2">
          <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-senja opacity-15" aria-hidden="true" />
          <div class="relative">
            <p class="eyebrow">{{ m.home.checkEyebrow }}</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight text-brand-700">{{ m.home.checkTitle }}</h2>
            <h3 class="mt-8 font-sans text-sm font-semibold text-ink">{{ m.home.symptomsTitle }}</h3>
            <ul class="mt-3 flex flex-wrap gap-2">
              <li v-for="g in m.home.symptoms" :key="g" class="rounded-full border border-accent-600/30 bg-sand-50 px-3.5 py-1.5 text-sm">
                {{ g }}
              </li>
            </ul>
            <h3 class="mt-7 font-sans text-sm font-semibold text-ink">{{ m.home.benefitsTitle }}</h3>
            <ul class="mt-2 space-y-1.5 text-sm text-ink/80">
              <li v-for="b in m.home.benefits" :key="b">— {{ b }}</li>
            </ul>
            <div class="mt-9 flex flex-wrap items-center gap-6">
              <p>
                <span class="block text-xs uppercase tracking-widest text-ink/55">{{ m.home.price }}</span>
                <span class="font-display text-3xl font-semibold text-brand-700">{{ rupiah(data?.screening.price ?? 0) }}</span>
              </p>
              <NuxtLink to="/cek-kesehatan-mental" class="btn-secondary">{{ m.home.registerNow }}</NuxtLink>
            </div>
          </div>

          <!-- Ilustrasi: contoh laporan -->
          <div class="relative mx-auto w-full max-w-sm rounded-2xl bg-sand-50 p-6 shadow-soft" aria-hidden="true">
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-widest text-ink/45">{{ m.home.reportTitle }}</p>
              <img src="/brand/mark.svg" alt="" class="h-7 w-auto" />
            </div>
            <div v-for="(r, i) in m.home.report" :key="r.label" class="mt-5">
              <div class="flex justify-between text-sm">
                <span>{{ r.label }}</span>
                <span class="font-semibold">{{ r.level }}</span>
              </div>
              <div class="mt-2 h-1.5 rounded-full bg-sand-200">
                <div class="h-1.5 rounded-full" :class="bars[i]!.color" :style="{ width: bars[i]!.value + '%' }" />
              </div>
            </div>
            <p class="mt-6 border-t border-sand-200 pt-4 text-xs leading-relaxed text-ink/60">{{ m.home.reportNote }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────── Profil + FAQ ───────────── -->
    <section id="profil" class="py-20">
      <div class="container-page grid gap-14 md:grid-cols-2">
        <div>
          <p class="eyebrow">{{ m.home.profileEyebrow }}</p>
          <h2 class="mt-3 text-3xl font-semibold tracking-tight text-brand-700 sm:text-4xl">{{ m.home.profileTitle }}</h2>
          <div class="mt-6 space-y-4 leading-relaxed text-ink/75">
            <p>{{ m.home.profileP1 }}</p>
            <p>{{ m.home.profileP2 }}</p>
          </div>
          <img src="/brand/logo-tagline.svg" alt="Rena Jiwa — Awal baru dimulai dari bercerita" class="mt-10 h-20 w-auto opacity-90" />
        </div>

        <div>
          <h3 class="font-display text-2xl font-semibold text-brand-700">{{ m.home.faqTitle }}</h3>
          <div class="mt-5 divide-y divide-brand-700/15 border-y border-brand-700/15">
            <details v-for="f in m.home.faqs" :key="f.q" class="group py-5">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-brand-700">
                {{ f.q }}
                <span
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-700/25 text-lg leading-none transition group-open:rotate-45 group-open:border-accent-600 group-open:text-accent-600"
                  aria-hidden="true"
                >+</span>
              </summary>
              <p class="mt-3 pr-10 text-sm leading-relaxed text-ink/75">{{ f.a }}</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { m } = useLocale()
useHead({ title: () => m.value.home.pageTitle })
const { data } = await useFetch('/api/services')
const { data: helpers } = await useFetch('/api/helpers')

const svc = (id: string) => m.value.services[id as keyof typeof m.value.services]
const tab = ref('psikolog')
const shownHelpers = computed(() => helpers.value?.filter((h) => h.type === tab.value) ?? [])
// harga sama untuk semua helper: Chat, Voice Call, Video Call
const prices = computed(() => helpers.value?.[0]?.options.map((o) => o.price) ?? [])

// tampilan batang pada contoh laporan (teksnya dari kamus bahasa)
const bars = [
  { value: 58, color: 'bg-accent-500' },
  { value: 32, color: 'bg-plum' },
  { value: 14, color: 'bg-brand-400' },
]
</script>
