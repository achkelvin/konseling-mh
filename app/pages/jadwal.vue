<template>
  <div />
</template>

<script setup lang="ts">
// Jadwal per psikolog disembunyikan selama baru ada satu psikolog
// (flag SITE.featureFlags.showPsychologistPicker). Tautan lama diarahkan ke pemesanan.
await navigateTo('/konseling', { redirectCode: 302 })
</script>
