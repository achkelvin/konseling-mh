<template>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-full font-bold"
    :class="[tone, size === 'lg' ? 'h-24 w-24 text-2xl' : 'h-14 w-14 text-base']"
    aria-hidden="true"
  >
    {{ initials(name) }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string; size?: 'md' | 'lg' }>()
const tones = [
  'bg-brand-100 text-brand-700',
  'bg-accent-100 text-accent-600',
  'bg-sand-200 text-brand-900',
]
const initials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
const tone = computed(() => tones[props.name.length % tones.length])
</script>
