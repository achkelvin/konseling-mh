<template>
  <div class="min-h-screen bg-sand-100 p-0 sm:p-6">
    <div
      class="mx-auto flex min-h-screen max-w-5xl flex-col overflow-hidden bg-white sm:min-h-[calc(100vh-3rem)] sm:rounded-3xl sm:shadow-soft md:flex-row"
    >
      <aside class="flex flex-col border-b border-sand-200 bg-sand-50 p-5 md:w-64 md:border-b-0 md:border-r md:p-6">
        <AppLogo />
        <p class="eyebrow mt-6 hidden md:block">Pendaftaran</p>
        <p class="hidden font-semibold md:block">{{ title }}</p>
        <ol class="mt-4 flex gap-1 overflow-x-auto md:flex-col md:gap-1.5">
          <li
            v-for="(s, i) in steps"
            :key="s"
            class="flex shrink-0 items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm"
            :class="i + 1 === current ? 'bg-white font-semibold shadow-sm' : 'text-ink/60'"
            :aria-current="i + 1 === current ? 'step' : undefined"
          >
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
              :class="
                i + 1 < current
                  ? 'bg-brand-600 text-white'
                  : i + 1 === current
                    ? 'bg-accent-500 text-white'
                    : 'border border-sand-200 bg-white'
              "
            >
              {{ i + 1 < current ? '✓' : i + 1 }}
            </span>
            <span :class="i + 1 === current ? '' : 'hidden md:inline'">{{ s }}</span>
          </li>
        </ol>
        <NuxtLink to="/" class="mt-auto hidden pt-6 text-sm text-ink/60 hover:text-brand-600 md:block">
          ← Kembali ke beranda
        </NuxtLink>
      </aside>

      <section class="flex flex-1 flex-col">
        <div class="flex-1 p-5 sm:p-8">
          <slot />
        </div>
        <div
          v-if="!hideFooter"
          class="sticky bottom-0 flex items-center justify-between gap-3 border-t border-sand-200 bg-white/95 p-4 backdrop-blur sm:px-8"
        >
          <button v-if="current > 1" class="btn-ghost" type="button" @click="$emit('back')">Kembali</button>
          <NuxtLink v-else to="/" class="btn-ghost md:invisible">Beranda</NuxtLink>
          <p v-if="error" class="flex-1 text-right text-sm text-red-600" role="alert">{{ error }}</p>
          <button class="btn-primary min-w-32" type="button" :disabled="!canNext || busy" @click="$emit('next')">
            {{ busy ? 'Memproses…' : current === steps.length ? submitLabel : 'Lanjut' }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  steps: string[]
  current: number
  canNext: boolean
  busy?: boolean
  error?: string
  submitLabel: string
  hideFooter?: boolean
}>()
defineEmits<{ back: []; next: [] }>()
</script>
