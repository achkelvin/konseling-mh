<template>
  <!-- Motif dua setengah lingkaran dari logo Rena Jiwa: senja (kiri) dan sage (kanan). -->
  <svg viewBox="0 0 220 120" :class="$attrs.class" aria-hidden="true">
    <defs>
      <linearGradient :id="gid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E3A25F" />
        <stop offset=".5" stop-color="#C46B3F" />
        <stop offset="1" stop-color="#7E5A7A" />
      </linearGradient>
    </defs>
    <path d="M40 8 A52 52 0 0 1 40 112 Z" :fill="`url(#${gid})`" />
    <path d="M180 8 A52 52 0 0 0 180 112 Z" fill="#98AC94" />
  </svg>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
const gid = 'senja-' + useId()
</script>
