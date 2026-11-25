<template>
  <div>
    <!-- ───────────── Hero ───────────── -->
    <section class="relative overflow-hidden">
      <div class="container-page grid items-center gap-12 pb-20 pt-12 md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-20">
        <div>
          <p class="eyebrow">{{ m.home.eyebrow }}</p>
          <h1 class="mt-4 text-[2.6rem] font-medium leading-[1.1] tracking-tight text-brand-700 sm:text-6xl">
            {{ m.home.tagline }}<span class="text-accent-600">.</span>
          </h1>
          <p class="mt-6 max-w-md text-lg leading-relaxed text-ink/75">{{ m.home.lead }}</p>
          <div class="mt-9 flex flex-wrap gap-3">
            <NuxtLink to="/konseling" class="btn-primary">
              {{ m.common.register }} <span aria-hidden="true">→</span>
            </NuxtLink>
            <NuxtLink to="/#layanan" class="btn-ghost">{{ m.nav.services }}</NuxtLink>
          </div>
          <ul class="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-brand-700/15 pt-5 text-sm text-ink/70">
            <li v-for="b in m.home.badges" :key="b" class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600" aria-hidden="true" />{{ b }}
            </li>
          </ul>
        </div>

        <!-- Komposisi motif logo -->
        <div class="relative mx-auto w-full max-w-md" aria-hidden="true">
          <div class="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-700">
            <HalfMoons class="absolute inset-x-8 top-14 w-[calc(100%-4rem)]" />
            <svg viewBox="0 0 220 260" class="absolute inset-x-8 top-14 w-[calc(100%-4rem)]" fill="none">
              <path d="M40 10 V250 M40 112 L180 250 V10" stroke="#F5F1E8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity=".9" />
            </svg>
          </div>
          <div class="absolute -bottom-8 -left-4 max-w-[17rem] rounded-2xl bg-sand-50 p-5 shadow-soft sm:-left-10">
            <p class="font-display text-lg font-medium leading-snug text-brand-700">{{ m.home.tagline }}</p>
            <p class="mt-2 text-xs font-medium uppercase tracking-widest text-accent-600">Rena Jiwa</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────── Layanan & Harga ───────────── -->
    <section id="layanan" class="border-t border-brand-700/10 bg-sand-50 py-20">
      <div class="container-page">
        <div class="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p class="eyebrow">{{ m.home.servicesEyebrow }}</p>
            <h2 class="mt-3 text-3xl font-medium tracking-tight text-brand-700 sm:text-4xl">{{ m.home.servicesTitle }}</h2>
          </div>
          <p class="max-w-md leading-relaxed text-ink/75 md:justify-self-end">{{ m.home.servicesLead }}</p>
        </div>

        <ul class="mt-12 divide-y divide-brand-700/15 border-y border-brand-700/15">
          <li v-for="s in services" :key="s.id" class="grid gap-4 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-xl font-medium text-brand-700">{{ m.services[s.id].name }}</h3>
                <span v-if="!s.bookable" class="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">{{ m.home.byRequest }}</span>
                <span v-if="s.id === 'mhcu'" class="rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-accent-700">{{ m.common.notDiagnosis }}</span>
                <span v-if="!s.discountable" class="rounded-full border border-brand-700/20 px-2.5 py-0.5 text-xs text-ink/60">{{ m.common.noDiscount }}</span>
              </div>
              <p class="mt-1.5 max-w-xl text-sm leading-relaxed text-ink/70">{{ m.services[s.id].desc }}</p>
              <NuxtLink v-if="s.id === 'mhcu'" to="/cek-kesehatan-mental" class="mt-2 inline-block text-sm font-semibold text-accent-600 underline underline-offset-4">
                {{ m.home.checkCta }}
              </NuxtLink>
            </div>
            <div class="flex items-center justify-between gap-6 sm:justify-end">
              <p class="text-right">
                <span class="block font-display text-2xl font-medium text-brand-700">{{ rupiah(s.priceIDR) }}</span>
                <span class="text-xs text-ink/55">{{ fmt(m.home.perSession, { min: s.minutes }) }}</span>
              </p>
              <a
                v-if="!s.bookable"
                :href="waLink(m.home.offlineWa)"
                target="_blank"
                rel="noopener"
                class="btn-ghost w-40 shrink-0 whitespace-nowrap"
              >
                <WhatsAppIcon class="h-4 w-4" /> {{ m.common.askAdmin }}
              </a>
              <NuxtLink v-else :to="`/konseling?service=${s.id}`" class="btn-primary w-40 shrink-0 whitespace-nowrap">{{ m.common.book }}</NuxtLink>
            </div>
          </li>
        </ul>

        <!-- Blok diskon (brief bagian 5) -->
        <div v-if="promoActive()" class="mt-10 grid gap-8 rounded-2xl bg-brand-700 p-7 text-sand-100 sm:p-10 md:grid-cols-[1fr_auto]">
          <div>
            <h3 class="text-2xl font-medium">{{ m.home.discountTitle }}</h3>
            <p class="mt-3 max-w-2xl leading-relaxed text-sand-100/85">{{ m.home.discountText }}</p>
            <dl class="mt-6 grid gap-5 sm:grid-cols-2">
              <div v-for="d in m.home.discountRows" :key="d.who">
                <dt class="font-semibold text-accent-300">{{ d.who }}</dt>
                <dd class="mt-1 text-sm leading-relaxed text-sand-100/80">{{ d.terms }}</dd>
              </div>
            </dl>
            <p class="mt-6 text-xs leading-relaxed text-sand-100/65">{{ m.home.discountFine }}</p>
          </div>
          <div class="rounded-xl bg-sand-100/10 p-5 md:min-w-56">
            <p class="text-xs uppercase tracking-widest text-sand-100/70">{{ m.home.discountPrices }}</p>
            <ul class="mt-3 space-y-2.5">
              <li v-for="s in discountable" :key="s.id" class="flex justify-between gap-6 text-sm">
                <span>{{ s.name }}</span>
                <span class="text-right">
                  <span class="mr-1.5 text-xs text-sand-100/50 line-through">{{ rupiah(s.priceIDR) }}</span>
                  <span class="font-semibold text-accent-300">{{ rupiah(priceFor(s.id, 'student').total) }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────── Cara kerja ───────────── -->
    <section id="cara-kerja" class="py-20">
      <div class="container-page">
        <p class="eyebrow">{{ m.home.howEyebrow }}</p>
        <h2 class="mt-3 text-3xl font-medium tracking-tight text-brand-700 sm:text-4xl">{{ m.home.howTitle }}</h2>
        <ol class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <li v-for="(h, i) in m.home.how" :key="h.title">
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full font-display text-base font-medium text-sand-50"
              :class="i % 2 === 0 ? 'bg-accent-600' : 'bg-brand-700'"
            >{{ i + 1 }}</span>
            <p class="mt-4 font-display text-lg font-medium text-brand-700">{{ h.title }}</p>
            <p class="mt-1.5 text-sm leading-relaxed text-ink/70">{{ h.text }}</p>
          </li>
        </ol>
        <div class="mt-12 rounded-2xl border border-brand-700/15 bg-sand-50 p-6 sm:p-8">
          <p class="font-display text-lg font-medium text-brand-700">{{ m.home.policyTitle }}</p>
          <ul class="mt-4 space-y-2.5 text-sm leading-relaxed text-ink/80">
            <li v-for="p in m.home.policies" :key="p" class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600" aria-hidden="true" />{{ p }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ───────────── Tentang Kami ───────────── -->
    <section id="tentang" class="bg-brand-700 py-20 text-sand-100">
      <div class="container-page grid gap-14 md:grid-cols-2">
        <div>
          <p class="eyebrow !text-accent-300">{{ m.home.aboutEyebrow }}</p>
          <h2 class="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">{{ m.home.aboutTitle }}</h2>
          <div class="mt-6 space-y-4 text-lg leading-relaxed text-sand-100/85">
            <p v-for="p in m.home.aboutStory" :key="p">{{ p }}</p>
          </div>
          <img src="/brand/mark-reversed.svg" alt="" class="mt-10 h-24 w-auto" />
        </div>

        <article class="self-start rounded-2xl bg-sand-100 p-7 text-ink sm:p-8">
          <p class="eyebrow">{{ m.home.psyEyebrow }}</p>
          <div class="mt-4 flex items-center gap-4">
            <!-- tanpa foto, pakai ikon logo sebagai avatar (brief bagian 6) -->
            <img src="/brand/icon.svg" alt="" class="h-16 w-16 shrink-0 rounded-2xl" />
            <div>
              <h3 class="text-lg font-medium leading-snug text-brand-700">{{ SITE.psychologist.name }}</h3>
              <p class="mt-0.5 text-sm text-accent-600">{{ m.home.psyRole }}</p>
            </div>
          </div>
          <ul class="mt-6 space-y-2.5 text-sm leading-relaxed">
            <li v-for="f in m.home.psyFacts" :key="f" class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />{{ f }}
            </li>
          </ul>
          <dl class="mt-6 grid gap-2 border-t border-sand-300 pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-xs uppercase tracking-widest text-ink/55">STRPK</dt>
              <dd class="font-mono">{{ SITE.psychologist.strpk }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-widest text-ink/55">SIPP</dt>
              <dd class="font-mono">{{ SITE.psychologist.sipp }}</dd>
            </div>
          </dl>
          <a :href="SITE.psychologist.verifyUrl" target="_blank" rel="noopener" class="mt-5 inline-flex text-sm font-semibold text-accent-600 underline underline-offset-4">
            {{ m.home.verify }} ↗
          </a>
        </article>
      </div>
    </section>

    <!-- ───────────── Testimoni (tersembunyi sampai flag aktif dan ada isi) ───────────── -->
    <section v-if="testimonials.length" id="testimoni" class="py-20">
      <div class="container-page">
        <h2 class="text-3xl font-medium tracking-tight text-brand-700">{{ m.home.testiTitle }}</h2>
        <div class="mt-8 flex snap-x gap-5 overflow-x-auto pb-4">
          <figure v-for="t in testimonials" :key="t.quote" class="card w-80 shrink-0 snap-start">
            <blockquote class="font-display text-lg leading-snug text-brand-700">“{{ t.quote }}”</blockquote>
            <figcaption class="mt-4 text-sm text-ink/60">— {{ t.name }}<span v-if="t.service"> · {{ t.service }}</span></figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ───────────── FAQ ───────────── -->
    <section id="faq" class="py-20">
      <div class="container-page grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 class="text-3xl font-medium tracking-tight text-brand-700 sm:text-4xl">{{ m.home.faqTitle }}</h2>
          <a :href="waLink('Halo admin Rena Jiwa, saya ingin bertanya.')" target="_blank" rel="noopener" class="btn-ghost mt-6">
            <WhatsAppIcon class="h-4 w-4" /> {{ m.common.askAdmin }}
          </a>
        </div>
        <div class="divide-y divide-brand-700/15 border-y border-brand-700/15">
          <details v-for="f in faqs" :key="f.q" class="group py-5">
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
    </section>
  </div>
</template>

<script setup lang="ts">
const { m, fmt } = useLocale()
useHead({ title: () => m.value.home.pageTitle })

const services = visibleServices()
const discountable = SITE.services.filter((s) => s.discountable)
const testimonials = SITE.featureFlags.showTestimonials ? SITE.testimonials.filter((t) => t.consent === true) : []
// FAQ "Offline?" ikut disembunyikan bila layanan offline dimatikan
const faqs = computed(() => m.value.home.faqs.filter((f) => !f.offline || SITE.featureFlags.offlineEnabled))
</script>
