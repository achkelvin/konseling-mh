<template>
  <div ref="root" class="relative" @keydown.esc="close(true)">
    <button
      ref="trigger"
      type="button"
      class="inline-flex items-center gap-1.5 rounded-full border border-sand-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand-200 hover:bg-brand-50"
      :aria-label="`${m.lang.switchTo} (${m.lang[lang]})`"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open = !open"
    >
      <!-- ikon bahasa (translate) -->
      <svg viewBox="0 0 24 24" class="h-4 w-4 text-brand-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
      <FlagIcon :code="lang" />
      <span class="uppercase">{{ lang }}</span>
      <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 text-ink/50 transition" :class="open ? 'rotate-180' : ''" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
      </svg>
    </button>

    <ul
      v-if="open"
      role="menu"
      :aria-label="m.lang.label"
      class="absolute z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-sand-200 bg-white py-1 shadow-soft"
      :class="align === 'left' ? 'left-0' : 'right-0'"
    >
      <li v-for="code in codes" :key="code" role="none">
        <button
          type="button"
          role="menuitemradio"
          :aria-checked="lang === code"
          class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-brand-50 focus-visible:bg-brand-50"
          :class="lang === code ? 'font-semibold text-brand-700' : ''"
          @click="choose(code)"
        >
          <FlagIcon :code="code" />
          <span class="flex-1">{{ m.lang[code] }}</span>
          <span v-if="lang === code" class="text-brand-600" aria-hidden="true">✓</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ align?: 'left' | 'right' }>(), { align: 'right' })

const { lang, setLang, m } = useLocale()
const codes = ['id', 'en'] as const
const open = ref(false)
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()

function close(focusTrigger = false) {
  open.value = false
  if (focusTrigger) trigger.value?.focus()
}
function choose(code: 'id' | 'en') {
  setLang(code)
  close(true)
}

// tutup saat klik di luar menu
function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) close()
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>
