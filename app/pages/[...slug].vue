<script setup lang="ts">
import { createError } from 'h3'
import { useAsyncData, useRoute } from '#app'

const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryContent(route.path).findOne()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
</template>
