<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { lang, m } = useLocale()
const route = useRoute()
const url = computed(() => SITE.brand.siteUrl + route.path)

useHead({
  htmlAttrs: { lang },
  link: [{ rel: 'canonical', href: url }],
})
// pratinjau tautan saat dibagikan di WhatsApp/Instagram
useSeoMeta({
  ogSiteName: 'Rena Jiwa',
  ogType: 'website',
  ogUrl: url,
  ogTitle: () => m.value.home.pageTitle,
  ogDescription: () => m.value.home.lead,
  ogImage: `${SITE.brand.siteUrl}/icon-512.png`,
  description: () => m.value.home.lead,
})
</script>

<style src="~/assets/css/main.css"></style>
