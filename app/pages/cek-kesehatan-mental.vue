<template>
  <div>
    <section class="container-page grid gap-12 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-20">
      <div>
        <p class="eyebrow">MHCU</p>
        <h1 class="mt-3 text-4xl font-medium tracking-tight text-brand-700 sm:text-5xl">{{ m.cek.title }}</h1>
        <p class="mt-5 max-w-lg text-lg leading-relaxed text-ink/75">{{ m.cek.lead }}</p>

        <h2 class="mt-10 font-display text-xl font-medium text-brand-700">{{ m.cek.stepsTitle }}</h2>
        <ol class="mt-4 space-y-4">
          <li v-for="(s, i) in m.cek.steps" :key="s" class="flex gap-4">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-sand-50">{{ i + 1 }}</span>
            <span class="pt-1 leading-relaxed text-ink/80">{{ s }}</span>
          </li>
        </ol>
      </div>

      <aside class="self-start rounded-2xl bg-brand-700 p-7 text-sand-100 sm:p-8">
        <p class="text-xs uppercase tracking-widest text-sand-100/70">{{ m.cek.priceLabel }}</p>
        <p class="mt-1 font-display text-4xl font-medium">{{ rupiah(mhcu!.priceIDR) }}</p>
        <p class="mt-1 text-sm text-sand-100/70">{{ m.cek.priceNote }} · {{ mhcu!.minutes }} {{ m.common.minutes }}</p>

        <div class="mt-6 rounded-xl bg-sand-100/10 p-4">
          <p class="font-semibold text-accent-300">{{ m.cek.notDiagnosisTitle }}</p>
          <p class="mt-1 text-sm leading-relaxed text-sand-100/85">{{ m.cek.notDiagnosisText }}</p>
        </div>

        <NuxtLink to="/konseling?service=mhcu" class="btn mt-7 w-full bg-sand-100 text-brand-700 hover:bg-white">
          {{ m.cek.cta }} <span aria-hidden="true">→</span>
        </NuxtLink>
        <p class="mt-4 text-xs leading-relaxed text-sand-100/60">{{ m.footer.emergencyText }}</p>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
const { m } = useLocale()
useHead({ title: () => m.value.cek.pageTitle })
const mhcu = serviceById('mhcu')
</script>
