<template>
  <NuxtLink to="/" class="inline-flex shrink-0 items-center" :aria-label="`Rena Jiwa — ${m.common.home}`">
    <!-- logo resmi dari contents/RenaJiwa_Logo_Pack (disalin ke public/brand) -->
    <img
      :src="variant === 'reversed' ? '/brand/logo-reversed.svg' : '/brand/logo.svg'"
      alt=""
      width="880"
      height="301"
      class="w-auto"
      :class="size === 'lg' ? 'h-14' : 'h-10'"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'light' | 'reversed'; size?: 'md' | 'lg' }>(), {
  variant: 'light',
  size: 'md',
})
const { m } = useLocale()
</script>
