<template>
  <article class="container-page max-w-3xl py-14 md:py-20">
    <p class="eyebrow">Rena Jiwa</p>
    <h1 class="mt-3 text-4xl font-medium tracking-tight text-brand-700">{{ title }}</h1>
    <p class="mt-4 rounded-lg bg-accent-50 px-4 py-3 text-sm text-accent-700">{{ m.legal.draft }}</p>
    <p v-if="m.legal.note" class="mt-3 text-sm text-ink/60">{{ m.legal.note }}</p>
    <div class="legal mt-10">
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string }>()
const { m } = useLocale()
useHead({ title: () => `${props.title} — Rena Jiwa` })
</script>

<style scoped>
.legal :deep(h2) {
  @apply mt-12 border-t border-brand-700/15 pt-8 text-2xl font-medium text-brand-700;
}
.legal :deep(h3) {
  @apply mt-8 font-display text-lg font-medium text-brand-700;
}
.legal :deep(p),
.legal :deep(li) {
  @apply leading-relaxed text-ink/85;
}
.legal :deep(p) {
  @apply mt-3;
}
.legal :deep(ul),
.legal :deep(ol) {
  @apply mt-3 space-y-2 pl-5;
}
.legal :deep(ul) {
  @apply list-disc;
}
.legal :deep(ol) {
  @apply list-decimal;
}
.legal :deep(li::marker) {
  @apply text-accent-600;
}
.legal :deep(a) {
  @apply font-semibold text-accent-600 underline underline-offset-4;
}
</style>
