<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { lang } = useLocale()
useHead({ htmlAttrs: { lang } })
</script>

<style src="~/assets/css/main.css"></style>
