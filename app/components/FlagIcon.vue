<template>
  <!-- Bendera sebagai SVG: emoji bendera tidak tampil di Windows. -->
  <svg
    v-if="code === 'id'"
    viewBox="0 0 3 2"
    class="h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10"
    aria-hidden="true"
  >
    <rect width="3" height="1" fill="#E70011" />
    <rect y="1" width="3" height="1" fill="#FFFFFF" />
  </svg>
  <svg
    v-else
    viewBox="0 0 60 30"
    class="h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10"
    aria-hidden="true"
  >
    <clipPath :id="`${uid}-s`"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath :id="`${uid}-t`"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g :clip-path="`url(#${uid}-s)`">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" stroke-width="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" :clip-path="`url(#${uid}-t)`" stroke="#C8102E" stroke-width="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" stroke-width="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6" />
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ code: 'id' | 'en' }>()
// id unik supaya clipPath tidak bentrok bila bendera tampil lebih dari sekali
const uid = 'flag-' + useId()
</script>
